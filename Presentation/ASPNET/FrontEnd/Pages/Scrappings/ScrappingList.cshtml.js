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
            warehouseListLookupData: [],
            scrappingStatusListLookupData: [],
            secondaryData: [],
            productListLookupData: [],
            mainTitle: null,
            id: '',
            number: '',
            scrappingDate: '',
            description: '',
            warehouseId: null,
            status: null,
            errors: {
                scrappingDate: '',
                warehouseId: '',
                status: ''
            },
            showComplexDiv: false,
            isSubmitting: false,
            totalMovementFormatted: '0.00'
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const secondaryGridRef = Vue.ref(null);
        const scrappingDateRef = Vue.ref(null);
        const warehouseIdRef = Vue.ref(null);
        const statusRef = Vue.ref(null);
        const numberRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.scrappingDate = '';
            state.errors.warehouseId = '';
            state.errors.status = '';

            let isValid = true;

            if (!state.scrappingDate) {
                state.errors.scrappingDate = 'Scrapping date is required.';
                isValid = false;
            }
            if (!state.warehouseId) {
                state.errors.warehouseId = 'Warehouse is required.';
                isValid = false;
            }
            if (!state.status) {
                state.errors.status = 'Status is required.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.number = '';
            state.scrappingDate = '';
            state.description = '';
            state.warehouseId = null;
            state.status = null;
            state.errors = {
                scrappingDate: '',
                warehouseId: '',
                status: ''
            };
            state.secondaryData = [];
        };

        const scrappingDatePicker = {
            obj: null,
            create: () => {
                scrappingDatePicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'اختر التاريخ',
                    format: 'yyyy-MM-dd',
                    value: state.scrappingDate ? new Date(state.scrappingDate) : null,
                    change: (e) => {
                        state.scrappingDate = e.value;
                    }
                });
                scrappingDatePicker.obj.appendTo(scrappingDateRef.value);
            },
            refresh: () => {
                if (scrappingDatePicker.obj) {
                    scrappingDatePicker.obj.value = state.scrappingDate ? new Date(state.scrappingDate) : null;
                }
            }
        };

        Vue.watch(
            () => state.scrappingDate,
            (newVal, oldVal) => {
                scrappingDatePicker.refresh();
                state.errors.scrappingDate = '';
            }
        );

        const numberText = {
            obj: null,
            create: () => {
                numberText.obj = new ej.inputs.TextBox({
                    placeholder: '[تلقائي]',
                });
                numberText.obj.appendTo(numberRef.value);
            }
        };

        const warehouseListLookup = {
            obj: null,
            create: () => {
                if (state.warehouseListLookupData && Array.isArray(state.warehouseListLookupData)) {
                    warehouseListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.warehouseListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'احتر المخزن',
                        allowFiltering: true,
                        filtering: (e) => {
                            e.preventDefaultAction = true;
                            let query = new ej.data.Query();
                            if (e.text !== '') {
                                query = query.where('name', 'startsWith', e.text, true);
                            }
                            e.updateData(state.warehouseListLookupData, query);
                        },
                        change: (e) => {
                            state.warehouseId = e.value;
                        }
                    });
                    warehouseListLookup.obj.appendTo(warehouseIdRef.value);
                }
            },
            refresh: () => {
                if (warehouseListLookup.obj) {
                    warehouseListLookup.obj.value = state.warehouseId;
                }
            }
        };

        Vue.watch(
            () => state.warehouseId,
            (newVal, oldVal) => {
                warehouseListLookup.refresh();
                state.errors.warehouseId = '';
            }
        );

        const statusListLookup = {
            obj: null,
            create: () => {
                if (state.scrappingStatusListLookupData && Array.isArray(state.scrappingStatusListLookupData)) {
                    statusListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.scrappingStatusListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'اختر الحالة',
                        allowFiltering: false,
                        change: (e) => {
                            state.status = e.value;
                        }
                    });
                    statusListLookup.obj.appendTo(statusRef.value);
                }
            },
            refresh: () => {
                if (statusListLookup.obj) {
                    statusListLookup.obj.value = state.status;
                }
            }
        };

        Vue.watch(
            () => state.status,
            (newVal, oldVal) => {
                statusListLookup.refresh();
                state.errors.status = '';
            }
        );

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Scrapping/GetScrappingList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (scrappingDate, description, status, warehouseId, createdById) => {
                try {
                    const response = await AxiosManager.post('/Scrapping/CreateScrapping', {
                        scrappingDate, description, status, warehouseId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, scrappingDate, description, status, warehouseId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/Scrapping/UpdateScrapping', {
                        id, scrappingDate, description, status, warehouseId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/Scrapping/DeleteScrapping', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getWarehouseListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Warehouse/GetWarehouseList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getScrappingStatusListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Scrapping/GetScrappingStatusList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getSecondaryData: async (moduleId) => {
                try {
                    const response = await AxiosManager.get('/InventoryTransaction/ScrappingGetInvenTransList?moduleId=' + moduleId, {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createSecondaryData: async (moduleId, productId, movement, createdById) => {
                try {
                    const response = await AxiosManager.post('/InventoryTransaction/ScrappingCreateInvenTrans', {
                        moduleId, productId, movement, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateSecondaryData: async (id, productId, movement, updatedById) => {
                try {
                    const response = await AxiosManager.post('/InventoryTransaction/ScrappingUpdateInvenTrans', {
                        id, productId, movement, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteSecondaryData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/InventoryTransaction/ScrappingDeleteInvenTrans', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getProductListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Product/GetProductList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    scrappingDate: new Date(item.scrappingDate),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateWarehouseListLookupData: async () => {
                const response = await services.getWarehouseListLookupData();
                state.warehouseListLookupData = response?.data?.content?.data.filter(warehouse => warehouse.systemWarehouse === false) || [];
            },
            populateScrappingStatusListLookupData: async () => {
                const response = await services.getScrappingStatusListLookupData();
                state.scrappingStatusListLookupData = response?.data?.content?.data;
            },
            populateSecondaryData: async (scrappingId) => {
                try {
                    const response = await services.getSecondaryData(scrappingId);
                    state.secondaryData = response?.data?.content?.data.map(item => ({
                        ...item,
                        createdAtUtc: new Date(item.createdAtUtc)
                    }));
                    methods.refreshSummary();
                } catch (error) {
                    state.secondaryData = [];
                }
            },
            populateProductListLookupData: async () => {
                const response = await services.getProductListLookupData();
                state.productListLookupData = response?.data?.content?.data
                    .filter(product => product.physical === true)
                    .map(product => ({
                        ...product,
                        numberName: `${product.number} - ${product.name}`
                    })) || [];
            },
            refreshSummary: () => {
                const totalMovement = state.secondaryData.reduce((sum, record) => sum + (record.movement ?? 0), 0);
                state.totalMovementFormatted = NumberFormatManager.formatToLocale(totalMovement);
            },

            onMainModalHidden: () => {
                state.errors.scrappingDate = '';
                state.errors.warehouseId = '';
                state.errors.status = '';
            },

            submitMainData: async () => {
                const isValid = validateForm();
                if (!isValid) {
                    return { isValid, response: null };
                }

                try {
                    const response = state.id === ''
                        ? await services.createMainData(state.scrappingDate, state.description, state.status, state.warehouseId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.scrappingDate, state.description, state.status, state.warehouseId, StorageManager.getUserId());

                    return { isValid, response };
                } catch (error) {
                    return { isValid, response: null };
                }
            },
        };

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));

                    const { isValid, response } = await methods.submitMainData();

                    if (!isValid) {
                        return;
                    }

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Scrapping';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            await methods.populateSecondaryData(state.id);
                            secondaryGrid.refresh();
                            state.showComplexDiv = true;

                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحفظ',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحذف',
                                text: 'الاغلاق من هنا...',
                                timer: 2000,
                                showConfirmButton: false
                            });
                            setTimeout(() => {
                                mainModal.obj.hide();
                                resetFormState();
                            }, 2000);
                        }
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
                } finally {
                    state.isSubmitting = false;
                }
            },
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['Scrappings']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden());

                await methods.populateWarehouseListLookupData();
                warehouseListLookup.create();
                await methods.populateScrappingStatusListLookupData();
                statusListLookup.create();
                scrappingDatePicker.create();
                numberText.create();

                await methods.populateProductListLookupData();
                await secondaryGrid.create(state.secondaryData);

            } catch (e) {
                console.error('page init error:', e);
            } finally {
                
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', methods.onMainModalHidden());
        });

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    height: '240px',
                    locale: 'ar',
                    enableRtl: true,
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

                        {
                            field: 'id',
                            isPrimaryKey: true,
                            headerText: 'المعرف',
                            visible: false
                        },

                        { field: 'number', headerText: 'الرقم', width: 150, minWidth: 150 },

                        { field: 'scrappingDate', headerText: 'تاريخ الإتلاف', width: 150, format: 'yyyy-MM-dd' },

                        { field: 'warehouseName', headerText: 'المستودع', width: 150, minWidth: 150 },

                        { field: 'statusName', headerText: 'الحالة', width: 150, minWidth: 150 },

                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء (UTC)', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],

                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'MainGrid_excelexport' },
                        'Search',
                        { type: 'Separator' },
                        { text: 'إضافة', tooltipText: 'Add', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'تعديل', tooltipText: 'Edit', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'حذف', tooltipText: 'Delete', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                        { text: 'طباعة PDF', tooltipText: 'Print PDF', id: 'PrintPDFCustom' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'PrintPDFCustom'], false);
                        mainGrid.obj.autoFitColumns(['number', 'scrappingDate', 'warehouseName', 'statusName', 'createdAtUtc']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'PrintPDFCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'PrintPDFCustom'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'PrintPDFCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'PrintPDFCustom'], false);
                        }
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
                            state.mainTitle = 'اضافة تالف';
                            resetFormState();
                            state.showComplexDiv = false;
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'تعديل تالف';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.scrappingDate = selectedRecord.scrappingDate ? new Date(selectedRecord.scrappingDate) : null;
                                state.description = selectedRecord.description ?? '';
                                state.warehouseId = selectedRecord.warehouseId ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                await methods.populateSecondaryData(selectedRecord.id);
                                secondaryGrid.refresh();
                                state.showComplexDiv = true;
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'حذف تالف?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.scrappingDate = selectedRecord.scrappingDate ? new Date(selectedRecord.scrappingDate) : null;
                                state.description = selectedRecord.description ?? '';
                                state.warehouseId = selectedRecord.warehouseId ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                await methods.populateSecondaryData(selectedRecord.id);
                                secondaryGrid.refresh();
                                state.showComplexDiv = false;
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'PrintPDFCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                window.open('/Scrappings/ScrappingPdf?id=' + (selectedRecord.id ?? ''), '_blank');
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

        const secondaryGrid = {
            obj: null,
            create: async (dataSource) => {
                secondaryGrid.obj = new ej.grids.Grid({
                    height: 400,
                    dataSource: dataSource,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, showDeleteConfirmDialog: true, mode: 'Normal', allowEditOnDblClick: true },
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: false,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: false,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'productName', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: false,
                    showColumnMenu: false,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'المعرف', visible: false
                        },
                        {
                            field: 'productId',
                            headerText: 'المنتج',
                            width: 250,
                            validationRules: { required: true },
                            disableHtmlEncode: false,
                            valueAccessor: (field, data, column) => {
                                const product = state.productListLookupData.find(item => item.id === data[field]);
                                return product ? `${product.numberName}` : '';
                            },
                            editType: 'dropdownedit',
                            edit: {
                                create: () => {
                                    productElem = document.createElement('input');
                                    return productElem;
                                },
                                read: () => {
                                    return productObj.value;
                                },
                                destroy: function () {
                                    productObj.destroy();
                                },
                                write: function (args) {
                                    productObj = new ej.dropdowns.DropDownList({
                                        dataSource: state.productListLookupData,
                                        fields: { value: 'id', text: 'name' },
                                        value: args.rowData.productId,
                                        change: function (e) {
                                            if (movementObj) {
                                                movementObj.value = 1;
                                            }
                                        },
                                        placeholder: 'اختر منتجاً',
                                        floatLabelType: 'Never'
                                    });

                                    productObj.appendTo(productElem);
                                }
                            }
                        },
                        {
                            field: 'movement',
                            headerText: 'الحركة',
                            width: 200,
                            validationRules: {
                                required: true,
                                custom: [(args) => {
                                    return args['value'] > 0;
                                }, 'يجب أن يكون عدداً موجباً وألا يساوي صفر']
                            },
                            type: 'number', format: 'N2', textAlign: 'Right',
                            edit: {
                                create: () => {
                                    movementElem = document.createElement('input');
                                    return movementElem;
                                },
                                read: () => {
                                    return movementObj.value;
                                },
                                destroy: function () {
                                    movementObj.destroy();
                                },
                                write: function (args) {
                                    movementObj = new ej.inputs.NumericTextBox({
                                        value: args.rowData.movement ?? 0,
                                    });
                                    movementObj.appendTo(movementElem);
                                }
                            }
                        },
                    ],
                    toolbar: [
                        'ExcelExport',
                        { type: 'Separator' },
                        'Add', 'Edit', 'Delete', 'Update', 'Cancel',
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () { },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (secondaryGrid.obj.getSelectedRecords().length == 1) {
                            secondaryGrid.obj.toolbarModule.enableItems(['SecondaryGrid_edit'], true);
                        } else {
                            secondaryGrid.obj.toolbarModule.enableItems(['SecondaryGrid_edit'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (secondaryGrid.obj.getSelectedRecords().length == 1) {
                            secondaryGrid.obj.toolbarModule.enableItems(['SecondaryGrid_edit'], true);
                        } else {
                            secondaryGrid.obj.toolbarModule.enableItems(['SecondaryGrid_edit'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (secondaryGrid.obj.getSelectedRecords().length) {
                            secondaryGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: (args) => {
                        if (args.item.id === 'SecondaryGrid_excelexport') {
                            secondaryGrid.obj.excelExport();
                        }
                    },
                    actionComplete: async (args) => {
                        if (args.requestType === 'save' && args.action === 'add') {
                            try {
                                const response = await services.createSecondaryData(state.id, args.data.productId, args.data.movement, StorageManager.getUserId());
                                await methods.populateSecondaryData(state.id);
                                secondaryGrid.refresh();
                                if (response.data.code === 200) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'تم الحفظ',
                                        timer: 2000,
                                        showConfirmButton: false
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'فشل الحفظ',
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
                            }
                        }
                        if (args.requestType === 'save' && args.action === 'edit') {
                            try {
                                const response = await services.updateSecondaryData(args.data.id, args.data.productId, args.data.movement, StorageManager.getUserId());
                                await methods.populateSecondaryData(state.id);
                                secondaryGrid.refresh();
                                if (response.data.code === 200) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'تم التحديث',
                                        timer: 2000,
                                        showConfirmButton: false
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'فشل التحديث',
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
                            }
                        }
                        if (args.requestType === 'delete') {
                            try {
                                const response = await services.deleteSecondaryData(args.data[0].id, StorageManager.getUserId());
                                await methods.populateSecondaryData(state.id);
                                secondaryGrid.refresh();
                                if (response.data.code === 200) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'تم الحذف',
                                        timer: 2000,
                                        showConfirmButton: false
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'فشل الحذف',
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
                            }
                        }
                        methods.refreshSummary();
                    }
                });
                secondaryGrid.obj.appendTo(secondaryGridRef.value);
            },
            refresh: () => {
                secondaryGrid.obj.setProperties({ dataSource: state.secondaryData });
            }
        };

        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };


        return {
            mainGridRef,
            mainModalRef,
            secondaryGridRef,
            scrappingDateRef,
            warehouseIdRef,
            statusRef,
            numberRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');