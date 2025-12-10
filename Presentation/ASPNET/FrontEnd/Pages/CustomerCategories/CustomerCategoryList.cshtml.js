ej.base.L10n.load({
    'ar': {
        'grid': {
            'EmptyRecord': 'لا توجد بيانات للعرض',
            'GroupDropArea': 'اسحب عنوان عمود هنا لتجميع البيانات',
            'UnGroup': 'اضغط لإلغاء التجميع',
            'Item': 'عنصر',
            'Items': 'عناصر',
            'Edit': 'تعديل',
            'Delete': 'حذف',
            'Update': 'تحديث',
            'Cancel': 'إلغاء',
            'Search': 'بحث',
            "Save": "ظحف",
            "Close": "اغلاق",
            'ExcelExport': 'تصدير إكسل',
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
            "GreaterThanOrEqual": " أكبر أو يساوي ",
            "AddVendorGroup": "اضافة مجموعة موردين"
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
            errors: {
                name: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);

        // الخدمات (API)
        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/CustomerCategory/GetCustomerCategoryList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (name, description, createdById) => {
                try {
                    const response = await AxiosManager.post('/CustomerCategory/CreateCustomerCategory', {
                        name, description, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, name, description, updatedById) => {
                try {
                    const response = await AxiosManager.post('/CustomerCategory/UpdateCustomerCategory', {
                        id, name, description, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/CustomerCategory/DeleteCustomerCategory', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        // جلب البيانات
        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            }
        };

        // TextBox للاسم
        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل الاسم',
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) {
                    nameText.obj.value = state.name;
                }
            }
        };

        Vue.watch(
            () => state.name,
            () => {
                state.errors.name = '';
                nameText.refresh();
            }
        );

        // حفظ / تعديل / حذف
        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 200));

                    let isValid = true;

                    // التحقق من الاسم
                    if (!state.name) {
                        state.errors.name = 'الاسم مطلوب.';
                        isValid = false;
                    }

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
                            text: 'تمت العملية بنجاح.',
                            timer: 2000,
                            showConfirmButton: false
                        });

                        setTimeout(() => {
                            mainModal.obj.hide();
                            resetFormState();
                        }, 2000);

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
                        confirmButtonText: 'موافق'
                    });
                } finally {
                    state.isSubmitting = false;
                }
            },
        };

        // إعادة ضبط النموذج
        const resetFormState = () => {
            state.id = '';
            state.name = '';
            state.description = '';
            state.errors = {
                name: ''
            };
        };

        // Grid الرئيسي
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
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "الكل"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                   

                    columns: [
                        { type: 'checkbox', width: 60 },
                        { field: 'id', isPrimaryKey: true, headerText: 'المعرف', visible: false },
                        { field: 'name', headerText: 'الاسم', width: 200, minWidth: 200 },
                        { field: 'description', headerText: 'الوصف', width: 350 },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء', width: 180, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'MainGrid_excelexport' },
                        'Search',
                        { type: 'Separator' },
                        { text: 'إضافة', tooltipText: 'إضافة', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'تعديل', tooltipText: 'تعديل', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'حذف', tooltipText: 'حذف', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                    ],
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['name', 'description', 'createdAtUtc']);
                    },
                    rowSelected: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], mainGrid.obj.getSelectedRecords().length === 1);
                    },
                    rowDeselected: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], mainGrid.obj.getSelectedRecords().length === 1);
                    },
                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) {
                            mainGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: async (args) => {
                        if (args.item.id === 'MainGrid_excelexport') {
                            mainGrid.obj.excelExport();
                        }

                        if (args.item.id === 'AddCustom') {
                            state.deleteMode = false;
                            state.mainTitle = 'إضافة فئة العملاء';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const rec = mainGrid.obj.getSelectedRecords()[0];
                                state.deleteMode = false;
                                state.mainTitle = 'تعديل فئة العملاء';
                                state.id = rec.id ?? '';
                                state.name = rec.name ?? '';
                                state.description = rec.description ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const rec = mainGrid.obj.getSelectedRecords()[0];
                                state.deleteMode = true;
                                state.mainTitle = 'هل تريد حذف فئة العملاء؟';
                                state.id = rec.id ?? '';
                                state.name = rec.name ?? '';
                                state.description = rec.description ?? '';
                                mainModal.obj.show();
                            }
                        }
                    }
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },
            refresh: () => {
                mainGrid.obj.setProperties({ dataSource: state.mainData });
            }
        };

        // المودال
        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, { backdrop: 'static', keyboard: false });
            }
        };

        // عند التحميل
        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['CustomerCategories']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                nameText.create();
                mainModal.create();
            } catch (e) {
                console.error('خطأ في تهيئة الصفحة:', e);
            }
        });

        return { mainGridRef, mainModalRef, nameRef, state, handler };
    }
};

Vue.createApp(App).mount('#app');
