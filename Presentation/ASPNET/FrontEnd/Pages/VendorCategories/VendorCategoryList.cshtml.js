ej.base.L10n.load({
    'ar': {
        'grid': {
            'EmptyRecord': 'لا توجد بيانات للعرض',
            'GroupDropArea': 'اسحب عنوان العمود هنا لتجميع البيانات',
            'UnGroup': 'اضغط لإلغاء التجميع',
            'Item': 'عنصر',
            'Items': 'عناصر',
            'Edit': 'تعديل',
            'Delete': 'حذف',
            'Update': 'تحديث',
            'Cancel': 'إلغاء',
            'Search': 'بحث',
            'Save': 'حفظ',
            'Close': 'إغلاق',
            'ExcelExport': 'تصدير إكسل',
            'AddVendorCategory': 'إضافة فئة موردين',
            "FilterButton": "تطبيق",
            "ClearButton": "مسح",
            "StartsWith": " يبدأ بـ ",
            "EndsWith": " ينتهي بـ ",
            "Contains": " يحتوي على ",
            "Equal": " يساوي ",
            "NotEqual": " لا يساوي ",
            "LessThan": " أصغر من ",
            "LessThanOrEqual": " أصغر أو يساوي ",
            "GreaterThan": " أكبر من ",
            "GreaterThanOrEqual": " أكبر أو يساوي "
        },
        'pager': {
            'currentPageInfo': 'صفحة {0} من {1}',
            'firstPageTooltip': 'الصفحة الأولى',
            'lastPageTooltip': 'الصفحة الأخيرة',
            'nextPageTooltip': 'الصفحة التالية',
            'previousPageTooltip': 'الصفحة السابقة',
            'nextPagerTooltip': 'التالي',
            'previousPagerTooltip': 'السابق',
            'totalItemsInfo': '({0} عناصر)'
        }
    }
});

const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            mainTitle: null,
            id: '',
            name: '',
            description: '',
            errors: { name: '' },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const nameRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                try { return await AxiosManager.get('/VendorCategory/GetVendorCategoryList', {}); }
                catch (error) { throw error; }
            },
            createMainData: async (name, description, createdById) => {
                try { return await AxiosManager.post('/VendorCategory/CreateVendorCategory', { name, description, createdById }); }
                catch (error) { throw error; }
            },
            updateMainData: async (id, name, description, updatedById) => {
                try { return await AxiosManager.post('/VendorCategory/UpdateVendorCategory', { id, name, description, updatedById }); }
                catch (error) { throw error; }
            },
            deleteMainData: async (id, deletedById) => {
                try { return await AxiosManager.post('/VendorCategory/DeleteVendorCategory', { id, deletedById }); }
                catch (error) { throw error; }
            },
        };

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            }
        };

        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({ placeholder: 'أدخل الاسم' });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => { if (nameText.obj) nameText.obj.value = state.name; }
        };

        Vue.watch(() => state.name, () => { state.errors.name = ''; nameText.refresh(); });

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 200));
                    let isValid = true;
                    if (!state.name) { state.errors.name = 'الاسم مطلوب.'; isValid = false; }
                    if (!isValid) return;

                    const response = state.id === ''
                        ? await services.createMainData(state.name, state.description, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.name, state.description, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();
                        Swal.fire({
                            icon: 'success',
                            title: state.deleteMode ? 'تم الحذف' : 'تم الحفظ',
                            text: 'سيتم الإغلاق تلقائيًا',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        setTimeout(() => { mainModal.obj.hide(); resetFormState(); }, 2000);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: state.deleteMode ? 'فشل الحذف' : 'فشل الحفظ',
                            text: response.data.message ?? 'يرجى التحقق من البيانات.',
                            confirmButtonText: 'حاول مرة أخرى'
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'حدث خطأ',
                        text: error.response?.data?.message ?? 'يرجى المحاولة مرة أخرى.',
                        confirmButtonText: 'OK'
                    });
                } finally { state.isSubmitting = false; }
            },
        };

        const resetFormState = () => {
            state.id = ''; state.name = ''; state.description = ''; state.errors = { name: '' };
        };

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    locale: 'ar',
                    enableRtl: true,
                    height: '240px',
                    dataSource: dataSource,
                    allowFiltering: true,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: true,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'createdAtUtc', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        { field: 'id', isPrimaryKey: true, headerText: 'معرف', visible: false },
                        { field: 'name', headerText: 'الاسم', width: 200, minWidth: 200 },
                        { field: 'description', headerText: 'الوصف', width: 400, minWidth: 400 },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'ExcelExport' },
                        'Search',
                        { type: 'Separator' },
                        { text: 'إضافة', tooltipText: 'إضافة جديد', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'تعديل', tooltipText: 'تعديل', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'حذف', tooltipText: 'حذف', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () { mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false); mainGrid.obj.autoFitColumns(['name', 'description', 'createdAtUtc']); },
                    excelExportComplete: () => { },
                    rowSelected: () => { mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], mainGrid.obj.getSelectedRecords().length == 1); },
                    rowDeselected: () => { mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], mainGrid.obj.getSelectedRecords().length == 1); },
                    rowSelecting: () => { if (mainGrid.obj.getSelectedRecords().length) mainGrid.obj.clearSelection(); },
                    toolbarClick: async (args) => {
                        if (args.item.id === 'ExcelExport') mainGrid.obj.excelExport();
                        if (args.item.id === 'AddCustom') { state.deleteMode = false; state.mainTitle = 'إضافة فئة موردين'; resetFormState(); mainModal.obj.show(); }
                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const sel = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'تعديل فئة موردين'; state.id = sel.id ?? ''; state.name = sel.name ?? ''; state.description = sel.description ?? ''; mainModal.obj.show();
                            }
                        }
                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const sel = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'حذف فئة موردين؟'; state.id = sel.id ?? ''; state.name = sel.name ?? ''; state.description = sel.description ?? ''; mainModal.obj.show();
                            }
                        }
                    }
                });
                mainGrid.obj.appendTo(mainGridRef.value);
            },
            refresh: () => { mainGrid.obj.setProperties({ dataSource: state.mainData }); }
        };

        const mainModal = { obj: null, create: () => { mainModal.obj = new bootstrap.Modal(document.getElementById('MainModal'), { backdrop: 'static', keyboard: false }); } };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['VendorCategories']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                nameText.create();
                mainModal.create();
            } catch (e) { console.error('page init error:', e); }
        });

        return { mainGridRef, nameRef, state, handler };
    }
};

Vue.createApp(App).mount('#app');
