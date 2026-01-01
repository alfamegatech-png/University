const App = {
    setup() {

        const state = Vue.reactive({
            number: '',
            commiteeDate: '',
            committeeDesionNumber: '',
            committeeList: [],
            mappedItems: []
        });

        const services = {
            getPDFData: async (id) => {
                const res = await AxiosManager.get(
                    '/GoodsExamine/GetGoodsExamineSingle?id=' + id
                );

                console.log('API RESPONSE 👉', res);

                // ✅ المسار الصح
                return res.data.content;
            }
        };

        const methods = {
            loadData: async (id) => {
                const result = await services.getPDFData(id);

                const header = result.data;
                const transactions = result.transactionList;

                state.number = header.number ?? '';

                state.commiteeDate = header.commiteeDate
                    ? new Date(header.commiteeDate).toLocaleDateString('ar-EG')
                    : '';

                state.committeeDesionNumber =
                    header.committeeDesionNumber ?? '';

                state.committeeList =
                    header.committeeList ?? [];

                state.mappedItems = (transactions ?? []).map(x => ({
                    product: `${x.product?.number ?? ''} - ${x.product?.name ?? ''}`,
                    qty: x.movement ?? '',
                    unit: 'عدد',
                    matchPercent: x.percentage ?? '',
                    accepted: x.itemStatus === true,
                    rejected: x.itemStatus === false,
                    reason: x.reasons ?? ''
                }));
            }
        };
        // ✅ رئيس اللجنة
        const chairman = Vue.computed(() =>
            state.committeeList.find(x => x.employeeType === 1)
        );

        // ✅ أعضاء اللجنة
        const members = Vue.computed(() =>
            state.committeeList.filter(x => x.employeeType === 0)
        );
        const handler = {
            downloadPDF: async () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('p', 'mm', 'a4');

                const pages = document.querySelectorAll('.print-area');

                for (let i = 0; i < pages.length; i++) {
                    const canvas = await html2canvas(pages[i], { scale: 2 });
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 210;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    if (i > 0) doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                }

                doc.save(`goods-examine-${state.number}.pdf`);
            }
        };

        Vue.onMounted(async () => {
            const id = new URLSearchParams(window.location.search).get('id');
            if (id) {
                await methods.loadData(id);
            }
        });

        // مهم جدًا
        return {
            state,
            chairman,
            members,
            handler
        };
    }
};

Vue.createApp(App).mount('#app');
