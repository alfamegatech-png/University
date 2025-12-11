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
            purchaseOrderListLookupData: [],
            goodsReceiveStatusListLookupData: [],
            secondaryData: [],
            productListLookupData: [],
            warehouseListLookupData: [],
            mainTitle: null,
            id: '',
            number: '',
            receiveDate: '',
            description: '',
            purchaseOrderId: null,
            status: null,
            errors: {
                receiveDate: '',
                purchaseOrderId: '',
                status: '',
                description: ''
            },
            showComplexDiv: false,
            isSubmitting: false,
            totalMovementFormatted: '0.00'
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const secondaryGridRef = Vue.ref(null);
        const receiveDateRef = Vue.ref(null);
        const purchaseOrderIdRef = Vue.ref(null);
        const statusRef = Vue.ref(null);
        const numberRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.receiveDate = '';
            state.errors.purchaseOrderId = '';
            state.errors.status = '';

            let isValid = true;

            if (!state.receiveDate) {
                state.errors.receiveDate = 'تاريخ الاستلام مطلوب.';
                isValid = false;
            }
            if (!state.purchaseOrderId) {
                state.errors.purchaseOrderId = 'أمر الشراء مطلوب.';
                isValid = false;
            }
            if (!state.status) {
                state.errors.status = 'الحالة مطلوبة.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.number = '';
            state.receiveDate = '';
            state.description = '';
            state.purchaseOrderId = null;
            state.status = null;
            state.errors = {
                receiveDate: '',
                purchaseOrderId: '',
                status: '',
                description: ''
            };
            state.secondaryData = [];
        };

        const receiveDatePicker = {
            obj: null,
            create: () => {
                receiveDatePicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'اختر التاريخ',
                    format: 'yyyy-MM-dd',
                    value: state.receiveDate ? new Date(state.receiveDate) : null,
                    change: (e) => {
                        state.receiveDate = e.value;
                    }
                });
                receiveDatePicker.obj.appendTo(receiveDateRef.value);
            },
            refresh: () => {
                if (receiveDatePicker.obj) {
                    receiveDatePicker.obj.value = state.receiveDate ? new Date(state.receiveDate) : null;
                }
            }
        };

        Vue.watch(() => state.receiveDate, () => { receiveDatePicker.refresh(); state.errors.receiveDate = ''; });

        const numberText = {
            obj: null,
            create: () => {
                numberText.obj = new ej.inputs.TextBox({
                    placeholder: '[تلقائي]',
                });
                numberText.obj.appendTo(numberRef.value);
            }
        };

        const purchaseOrderListLookup = {
            obj: null,
            create: () => {
                if (state.purchaseOrderListLookupData && Array.isArray(state.purchaseOrderListLookupData)) {
                    purchaseOrderListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.purchaseOrderListLookupData,
                        fields: { value: 'id', text: 'number' },
                        placeholder: 'اختر أمر الشراء',
                        filterBarPlaceholder: 'بحث',
                        allowFiltering: true,
                        sortOrder: 'Ascending',
                        filtering: (e) => {
                            e.preventDefaultAction = true;
                            let query = new ej.data.Query();
                            if (e.text !== '') {
                                query = query.where('number', 'startsWith', e.text, true);
                            }
                            e.updateData(state.purchaseOrderListLookupData, query);
                        },
                        change: (e) => {
                            state.purchaseOrderId = e.value;
                        }
                    });
                    purchaseOrderListLookup.obj.appendTo(purchaseOrderIdRef.value);
                }
            },
            refresh: () => {
                if (purchaseOrderListLookup.obj) {
                    purchaseOrderListLookup.obj.value = state.purchaseOrderId
                }
            },
        };

        Vue.watch(() => state.purchaseOrderId, () => { purchaseOrderListLookup.refresh(); state.errors.purchaseOrderId = ''; });

        const goodsReceiveStatusListLookup = {
            obj: null,
            create: () => {
                if (state.goodsReceiveStatusListLookupData && Array.isArray(state.goodsReceiveStatusListLookupData)) {
                    goodsReceiveStatusListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.goodsReceiveStatusListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'اختر الحالة',
                        allowFiltering: false,
                        change: (e) => {
                            state.status = e.value;
                        }
                    });
                    goodsReceiveStatusListLookup.obj.appendTo(statusRef.value);
                }
            },
            refresh: () => {
                if (goodsReceiveStatusListLookup.obj) {
                    goodsReceiveStatusListLookup.obj.value = state.status
                }
            },
        };

        Vue.watch(() => state.status, () => { goodsReceiveStatusListLookup.refresh(); state.errors.status = ''; });

        const services = {
            getMainData: async () => await AxiosManager.get('/GoodsReceive/GetGoodsReceiveList'),
            createMainData: async (receiveDate, description, status, purchaseOrderId, createdById) =>
                await AxiosManager.post('/GoodsReceive/CreateGoodsReceive', {
                    receiveDate, description, status, purchaseOrderId, createdById
                }),
            updateMainData: async (id, receiveDate, description, status, purchaseOrderId, updatedById) =>
                await AxiosManager.post('/GoodsReceive/UpdateGoodsReceive', {
                    id, receiveDate, description, status, purchaseOrderId, updatedById
                }),
            deleteMainData: async (id, deletedById) =>
                await AxiosManager.post('/GoodsReceive/DeleteGoodsReceive', { id, deletedById }),
            getPurchaseOrderListLookupData: async () =>
                await AxiosManager.get('/PurchaseOrder/GetPurchaseOrderList'),
            getGoodsReceiveStatusListLookupData: async () =>
                await AxiosManager.get('/GoodsReceive/GetGoodsReceiveStatusList'),
            getSecondaryData: async (moduleId) =>
                await AxiosManager.get('/InventoryTransaction/GoodsReceiveGetInvenTransList?moduleId=' + moduleId),
            createSecondaryData: async (moduleId, warehouseId, productId, movement, createdById) =>
                await AxiosManager.post('/InventoryTransaction/GoodsReceiveCreateInvenTrans', {
                    moduleId, warehouseId, productId, movement, createdById
                }),
            updateSecondaryData: async (id, warehouseId, productId, movement, updatedById) =>
                await AxiosManager.post('/InventoryTransaction/GoodsReceiveUpdateInvenTrans', {
                    id, warehouseId, productId, movement, updatedById
                }),
            deleteSecondaryData: async (id, deletedById) =>
                await AxiosManager.post('/InventoryTransaction/GoodsReceiveDeleteInvenTrans', { id, deletedById }),
            getProductListLookupData: async () =>
                await AxiosManager.get('/Product/GetProductList'),
            getWarehouseListLookupData: async () =>
                await AxiosManager.get('/Warehouse/GetWarehouseList'),
        };

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    receiveDate: new Date(item.receiveDate),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populatePurchaseOrderListLookupData: async () => {
                const response = await services.getPurchaseOrderListLookupData();
                state.purchaseOrderListLookupData = response?.data?.content?.data;
            },
            populateGoodsReceiveStatusListLookupData: async () => {
                const response = await services.getGoodsReceiveStatusListLookupData();
                state.goodsReceiveStatusListLookupData = response?.data?.content?.data;
            },
            populateProductListLookupData: async () => {
                const response = await services.getProductListLookupData();
                state.productListLookupData =
                    response?.data?.content?.data
                        .filter(p => p.physical === true)
                        .map(p => ({ ...p, numberName: `${p.number} - ${p.name}` }));
            },
            populateWarehouseListLookupData: async () => {
                const response = await services.getWarehouseListLookupData();
                state.warehouseListLookupData =
                    response?.data?.content?.data.filter(w => w.systemWarehouse === false);
            },
            populateSecondaryData: async (goodsReceiveId) => {
                const response = await services.getSecondaryData(goodsReceiveId);
                state.secondaryData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
                methods.refreshSummary();
            },
            refreshSummary: () => {
                const totalMovement = state.secondaryData.reduce((sum, r) => sum + (r.movement ?? 0), 0);
                state.totalMovementFormatted = NumberFormatManager.formatToLocale(totalMovement);
            },
            onMainModalHidden: () => {
                state.errors.receiveDate = '';
                state.errors.purchaseOrderId = '';
                state.errors.status = '';
            }
        };

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(r => setTimeout(r, 300));

                    if (!validateForm()) return;

                    const response =
                        state.id === ''
                            ? await services.createMainData(state.receiveDate, state.description, state.status, state.purchaseOrderId, StorageManager.getUserId())
                            : state.deleteMode
                                ? await services.deleteMainData(state.id, StorageManager.getUserId())
                                : await services.updateMainData(state.id, state.receiveDate, state.description, state.status, state.purchaseOrderId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'تعديل استلام البضائع';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            await methods.populateSecondaryData(state.id);
                            secondaryGrid.refresh();
                            state.showComplexDiv = true;

                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحفظ بنجاح',
                                timer: 2000,
                                showConfirmButton: false
                            });

                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحذف بنجاح',
                                text: 'سيتم الإغلاق...',
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
                        confirmButtonText: 'موافق'
                    });
                } finally {
                    state.isSubmitting = false;
                }
            }
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['GoodsReceives']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden);
                await methods.populatePurchaseOrderListLookupData();
                await methods.populateGoodsReceiveStatusListLookupData();
                numberText.create();
                receiveDatePicker.create();
                purchaseOrderListLookup.create();
                goodsReceiveStatusListLookup.create();

                await secondaryGrid.create(state.secondaryData);
                await methods.populateProductListLookupData();
                await methods.populateWarehouseListLookupData();

            } catch (e) {
                console.error('page init error:', e);
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', methods.onMainModalHidden);
        });

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    height: '240px',
                    locale: 'ar',
                    enableRtl: true,
                    dataSource,
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
                    pageSettings: {
                        currentPage: 1,
                        pageSize: 50,
                        pageSizes: ["10", "20", "50", "100", "200", "All"]
                    },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        { field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false },
                        { field: 'number', headerText: 'الرقم', width: 150 },
                        { field: 'receiveDate', headerText: 'تاريخ الاستلام', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'purchaseOrderNumber', headerText: 'أمر الشراء', width: 150 },
                        { field: 'statusName', headerText: 'الحالة', width: 150 },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء', width: 150, format: 'yyyy-MM-dd HH:mm' },
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
                            state.mainTitle = 'إضافة استلام بضاعة';
                            resetFormState();
                            state.showComplexDiv = false;
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            const selected = mainGrid.obj.getSelectedRecords()[0];
                            if (selected) {
                                state.mainTitle = 'تعديل استلام بضاعة';
                                state.id = selected.id;
                                state.number = selected.number;
                                state.receiveDate = new Date(selected.receiveDate)
                                state.description = selected.description ?? '';
                                state.purchaseOrderId = selected.purchaseOrderId ?? '';
                                state.status = String(selected.status ?? '');
                                await methods.populateSecondaryData(selected.id);
                                secondaryGrid.refresh();
                                state.showComplexDiv = true;
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            const selected = mainGrid.obj.getSelectedRecords()[0];
                            if (selected) {
                                state.mainTitle = 'هل تريد حذف استلام البضاعة؟';
                                state.id = selected.id;
                                state.number = selected.number;
                                state.receiveDate = new Date(selected.receiveDate)
                                state.description = selected.description ?? '';
                                state.purchaseOrderId = selected.purchaseOrderId ?? '';
                                state.status = String(selected.status ?? '');
                                await methods.populateSecondaryData(selected.id);
                                secondaryGrid.refresh();
                                state.showComplexDiv = false;
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'PrintPDFCustom') {
                            const selected = mainGrid.obj.getSelectedRecords()[0];
                            if (selected) {
                                window.open('/GoodsReceives/GoodsReceivePdf?id=' + selected.id, '_blank');
                            }
                        }
                    }
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },
            refresh: () => mainGrid.obj.setProperties({ dataSource: state.mainData })
        };

        const secondaryGrid = {
            obj: null,
            create: async (dataSource) => {
                secondaryGrid.obj = new ej.grids.Grid({
                    height: 400,
                    dataSource,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true,
                        showDeleteConfirmDialog: true,
                        mode: 'Normal',
                    },
                    allowSorting: true,
                    allowExcelExport: true,
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { field: 'id', isPrimaryKey: true, visible: false },
                        { field: 'warehouseId', headerText: 'المخزن', width: 200 },
                        { field: 'productId', headerText: 'الصنف', width: 200 },
                        { field: 'movement', headerText: 'الحركة', width: 150, format: 'N2' },
                    ],
                    toolbar: [
                        'ExcelExport',
                        { type: 'Separator' },
                        'Add', 'Edit', 'Delete', 'Update', 'Cancel',
                    ],
                });

                secondaryGrid.obj.appendTo(secondaryGridRef.value);
            },
            refresh: () => secondaryGrid.obj.setProperties({ dataSource: state.secondaryData })
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
            numberRef,
            receiveDateRef,
            purchaseOrderIdRef,
            statusRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');
