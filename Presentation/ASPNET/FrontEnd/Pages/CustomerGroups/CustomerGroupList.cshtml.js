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
            "FilterButton": "تطبيق",
            "ClearButton": "مسح"
        },
        'pager': {
            'currentPageInfo': 'صفحة {0} من {1}',
            'firstPageTooltip': 'الصفحة الأولى',
            'lastPageTooltip': 'الصفحة الأخيرة',
            'nextPageTooltip': 'الصفحة التالية',
            'previousPageTooltip': 'الصفحة السابقة',
            'totalItemsInfo': '({0} عناصر)'
        }
    }
});

const App = {
    setup() {

        // -----------------------------
        // STATE
        // -----------------------------
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
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);

        // -----------------------------
        // SERVICES
        // -----------------------------
        const services = {

            getMainData: async () =>
                await AxiosManager.get('/CustomerGroup/GetCustomerGroupList'),

            createMainData: async (name, description, createdById) =>
                await AxiosManager.post('/CustomerGroup/CreateCustomerGroup', { name, description, createdById }),

            updateMainData: async (id, name, description, updatedById) =>
                await AxiosManager.post('/CustomerGroup/UpdateCustomerGroup', { id, name, description, updatedById }),

            deleteMainData: async (id, deletedById) =>
                await AxiosManager.post('/CustomerGroup/DeleteCustomerGroup', { id, deletedById })
        };

        // -----------------------------
        // LOAD DATA
        // -----------------------------
        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            }
        };

        // -----------------------------
        // NAME TEXTBOX
        // -----------------------------
        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل الاسم'
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) nameText.obj.value = state.name;
            }
        };

        Vue.watch(() => state.name, () => {
            state.errors.name = '';
            nameText.refresh();
        });

        // -----------------------------
        // SUBMIT HANDLER
        // -----------------------------
        const handler = {
            handleSubmit: async function () {

                try {
                    state.isSubmitting = true;
                    let isValid = true;

                    if (!state.name) {
                        state.errors.name = 'الاسم مطلوب.';
                        isValid = false;
                    }

                    if (!isValid) return;

                    const userId = StorageManager.getUserId();

                    const response =
                        state.id === ''
                            ? await services.createMainData(state.name, state.description, userId)
                            : state.deleteMode
                                ? await services.deleteMainData(state.id, userId)
                                : await services.updateMainData(state.id, state.name, state.description, userId);

                    if (response.data.code === 200) {

                        await methods.populateMainData();
                        mainGrid.refresh();

                        Swal.fire({
                            icon: 'success',
                            title: state.deleteMode ? 'تم الحذف' : 'تم الحفظ',
                            text: 'تمت العملية بنجاح',
                            timer: 1800,
                            showConfirmButton: false
                        });

                        setTimeout(() => {
                            mainModal.obj.hide();
                            resetFormState();
                        }, 1800);

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'خطأ',
                            text: response.data.message ?? 'حدث خطأ غير متوقع',
                            confirmButtonText: 'موافق'
                        });
                    }

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'خطأ',
                        text: error.response?.data?.message ?? 'يرجى المحاولة لاحقاً',
                    });
                } finally {
                    state.isSubmitting = false;
                }
            }
        };

        // -----------------------------
        // RESET FORM
        // -----------------------------
        const resetFormState = () => {
            state.id = '';
            state.name = '';
            state.description = '';
            state.errors.name = '';
        };

        // -----------------------------
        // GRID
        // -----------------------------
        const mainGrid = {
            obj: null,
            create: async (dataSource) => {

                mainGrid.obj = new ej.grids.Grid({
                    dataSource,
                    height: 350,
                    locale: 'ar',
                    enableRtl: true,

                    allowFiltering: true,
                    allowSorting: true,
                    allowPaging: true,
                    allowSelection: true,
                    allowExcelExport: true,

                    filterSettings: { type: 'CheckBox' },
                    selectionSettings: { type: 'Single' },

                    columns: [
                        { type: 'checkbox', width: 60 },
                        { field: 'id', visible: false },
                        { field: 'name', headerText: 'اسم المجموعة', width: 200 },
                        { field: 'description', headerText: 'الوصف', width: 350 },
                        {
                            field: 'createdAtUtc',
                            headerText: 'تاريخ الإنشاء',
                            width: 180,
                            format: 'yyyy-MM-dd HH:mm'
                        }
                    ],

                    toolbar: [
                        { text: 'تصدير إكسل', id: 'MainGrid_excelexport', prefixIcon: 'e-excelexport' },
                        'Search',
                        { type: 'Separator' },
                        { text: 'إضافة', id: 'AddCustom', prefixIcon: 'e-add' },
                        { text: 'تعديل', id: 'EditCustom', prefixIcon: 'e-edit' },
                        { text: 'حذف', id: 'DeleteCustom', prefixIcon: 'e-delete' }
                    ],

                    dataBound: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                    },

                    rowSelected: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], true);
                    },

                    rowDeselected: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                    },

                    // ❗ تمت إزالة rowSelecting لأنه سبب المشكلة

                    toolbarClick: (args) => {

                        if (args.item.id === 'MainGrid_excelexport')
                            return mainGrid.obj.excelExport();

                        if (args.item.id === 'AddCustom') {
                            state.deleteMode = false;
                            state.mainTitle = 'إضافة مجموعة عملاء';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            const rec = mainGrid.obj.getSelectedRecords()[0];
                            if (!rec) return;

                            state.deleteMode = false;
                            state.mainTitle = 'تعديل مجموعة العملاء';
                            state.id = rec.id;
                            state.name = rec.name;
                            state.description = rec.description;
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'DeleteCustom') {
                            const rec = mainGrid.obj.getSelectedRecords()[0];
                            if (!rec) return;

                            state.deleteMode = true;
                            state.mainTitle = 'هل تريد حذف مجموعة العملاء؟';
                            state.id = rec.id;
                            state.name = rec.name;
                            state.description = rec.description;
                            mainModal.obj.show();
                        }
                    },
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },

            refresh: () => {
                mainGrid.obj.setProperties({ dataSource: state.mainData });
            }
        };

        // -----------------------------
        // MODAL
        // -----------------------------
        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        // -----------------------------
        // ON MOUNTED
        // -----------------------------
        Vue.onMounted(async () => {
            await SecurityManager.authorizePage(['CustomerGroups']);
            await SecurityManager.validateToken();

            await methods.populateMainData();

            await mainGrid.create(state.mainData);
            nameText.create();
            mainModal.create();
        });

        return { mainGridRef, mainModalRef, nameRef, state, handler };
    }
};

Vue.createApp(App).mount('#app');
