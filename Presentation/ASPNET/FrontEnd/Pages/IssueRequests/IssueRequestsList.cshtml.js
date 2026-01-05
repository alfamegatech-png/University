ej.base.L10n.load({
    'ar': {
        'grid': {
            'EmptyRecord': 'لا توجد بيانات للعرض',
            'GroupDropArea': 'اسحب عنوان العمود هنا لتجميع البيانات',
            'UnGroup': 'اضغط لإلغاء التجميع',
            'Item': 'عنصر',
            'Items': 'عناصر',
            'Add': 'إضافة',
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
            employeeListLookupData: [],
            departmentId: null,
            departmentListLookupData: [],
            warehouseListLookupData: [],
           // taxListLookupData: [],
            issueRequestsStatusListLookupData: [],
            secondaryData: [],
            productListLookupData: [],
            mainTitle: null,
            id: '',
            number: '',
            orderDate: '',
            description: '',
            employeeId: null,
            //taxId: null,
            orderStatus: null,
            errors: {
                orderDate: '',
                employeeId: '',
                //taxId: '',
                orderStatus: '',
                description: ''
            },
            showComplexDiv: false,
            isSubmitting: false,
            subTotalAmount: '0.00',
            //taxAmount: '0.00',
            totalAmount: '0.00'
        });

     
       
        const isDraft = Vue.computed(() => state.orderStatus === 0);





        let productObj, priceObj, numberObj, summaryObj;
        let availableQuantityObj, requestedQtyObj, suppliedQtyObj, totalObj;
        let warehouseObj;


        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const orderDateRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const employeeIdRef = Vue.ref(null);
        const departmentIdRef = Vue.ref(null);

        //const taxIdRef = Vue.ref(null);
        const orderStatusRef = Vue.ref(null);
        const secondaryGridRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.orderDate = '';
            state.errors.employeeId = '';
            //state.errors.taxId = '';
            state.errors.orderStatus = '';

            let isValid = true;

            if (!state.orderDate) {
                state.errors.orderDate = 'يجب اختيار تاريخ الطلب';
                isValid = false;
            }
            if (!state.employeeId) {
                state.errors.employeeId = 'يجب اختيار موظف';
                isValid = false;
            }
            //if (!state.taxId) {
            //    state.errors.taxId = 'Tax is required.';
            //    isValid = false;
            //}
            if (!state.orderStatus) {
                state.errors.orderStatus = 'يجب اختيار حالة الطلب';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.number = '';
            state.orderDate = '';
            state.description = '';
            state.departmentId = null;
            state.employeeId = null;
            //state.taxId = null;
            state.orderStatus = null;
            state.errors = {
                orderDate: '',
                employeeId: '',
                departmentId: '',
               // taxId: '',
                orderStatus: '',
                description: ''
            };
            state.secondaryData = [];
            state.subTotalAmount = '0.00';
            //state.taxAmount = '0.00';
            state.totalAmount = '0.00';
            state.showComplexDiv = false;
        };

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/IssueRequests/GetIssueRequestsList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (orderDate, description, orderStatus, /*depId,*/ employeeId, createdById) => {
                try {
                    const response = await AxiosManager.post('/IssueRequests/CreateIssueRequests', {
                        orderDate, description, orderStatus, /*taxId,*/ employeeId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, orderDate, description, orderStatus,/* taxId,*/ employeeId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/IssueRequests/UpdateIssueRequests', {
                        id, orderDate, description, orderStatus, /*taxId,*/ employeeId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/IssueRequests/DeleteIssueRequests', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getWarehouseListLookupData: async () => {
                return await AxiosManager.get('/Warehouse/GetWarehouseList', {});
            },

            getDepartmentListLookupData: async () => {
                return await AxiosManager.get('/Department/GetDepartmentList', {});
            },
            getEmployeeListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Employee/GetEmployeeList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
          
            //getTaxListLookupData: async () => {
            //    try {
            //        const response = await AxiosManager.get('/Tax/GetTaxList', {});
            //        return response;
            //    } catch (error) {
            //        throw error;
            //    }
            //},
            getIssueRequestsStatusListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/IssueRequests/GetIssueRequestsStatusList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getSecondaryData: async (issueRequestsId) => {
                try {
                    const response = await AxiosManager.get('/IssueRequestsItem/GetIssueRequestsItemByIssueRequestsIdList?issueRequestsId=' + issueRequestsId, {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createSecondaryData: async (unitPrice, /*availableQuantity,*/ requestedQuantity, suppliedQuantity, summary, productId, warehouseId, issueRequestsId, createdById) => {
                try {
                    const response = await AxiosManager.post('/IssueRequestsItem/CreateIssueRequestsItem', {
                        unitPrice, /*availableQuantity,*/ requestedQuantity, suppliedQuantity, summary, productId, warehouseId, issueRequestsId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateSecondaryData: async (id, unitPrice, /*availableQuantity,*/ requestedQuantity, suppliedQuantity, summary, productId, warehouseId, issueRequestsId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/IssueRequestsItem/UpdateIssueRequestsItem', {
                        id, unitPrice, /*availableQuantity,*/ requestedQuantity, suppliedQuantity, summary, productId, warehouseId, issueRequestsId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteSecondaryData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/IssueRequestsItem/DeleteIssueRequestsItem', {
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
            }
        };

        const methods = {
            populateWarehouseListLookupData: async () => {
                const response = await services.getWarehouseListLookupData();
                state.warehouseListLookupData = response?.data?.content?.data;
            },

            populateDepartmentListLookupData: async () => {
                const response = await services.getDepartmentListLookupData();
                state.departmentListLookupData = response?.data?.content?.data;
            },

            populateEmployeeListLookupData: async () => {
                const response = await services.getEmployeeListLookupData();
                state.employeeListLookupData = response?.data?.content?.data;
            },
            //populateTaxListLookupData: async () => {
            //    const response = await services.getTaxListLookupData();
            //    state.taxListLookupData = response?.data?.content?.data;
            //},
          
            populateIssueRequestsStatusListLookupData: async () => {
                const response = await services.getIssueRequestsStatusListLookupData();
                const data = response?.data?.content?.data ?? [];

                state.issueRequestsStatusListLookupData = data.map(item => ({
                    id: Number(item.id), // MUST be number
                    name:
                        item.name === 'Draft' ? 'مسودة' :
                            item.name === 'Confirmed' ? 'مؤكد' :
                                item.name === 'Cancelled' ? 'ملغي' :
                                    item.name === 'Archived' ? 'مؤرشف' :
                                        item.name
                }));
            },



            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    orderDate: new Date(item.orderDate),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateSecondaryData: async (issueRequests) => {
                try {
                    const response = await services.getSecondaryData(issueRequests);
                    state.secondaryData = response?.data?.content?.data.map(item => ({
                        ...item,
                        createdAtUtc: new Date(item.createdAtUtc)
                    }));
                    methods.refreshPaymentSummary(issueRequests);
                } catch (error) {
                    state.secondaryData = [];
                }
            },
            populateProductListLookupData: async () => {
                const response = await services.getProductListLookupData();
                state.productListLookupData = response?.data?.content?.data;
            },
            refreshPaymentSummary: async (id) => {
                const record = state.mainData.find(item => item.id === id);
                if (record) {
                    state.subTotalAmount = NumberFormatManager.formatToLocale(record.beforeTaxAmount ?? 0);
                   // state.taxAmount = NumberFormatManager.formatToLocale(record.taxAmount ?? 0);
                    state.totalAmount = NumberFormatManager.formatToLocale(record.afterTaxAmount ?? 0);
                }
            },
            handleFormSubmit: async () => {
                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 200));

                if (!validateForm()) {
                    state.isSubmitting = false;
                    return;
                }

                try {
                    const response = state.id === ''
                        ? await services.createMainData(state.orderDate, state.description, state.orderStatus, state.employeeId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.orderDate, state.description, state.orderStatus, state.employeeId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Sales Order';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            state.orderDate = response?.data?.content?.data.orderDate ? new Date(response.data.content.data.orderDate) : null;
                            state.description = response?.data?.content?.data.description ?? '';
                            state.departmentId = response?.data?.content?.data.departmentId ?? '';
                            state.employeeId = response?.data?.content?.data.employeeId ?? '';
                            
                            //state.taxId = response?.data?.content?.data.taxId ?? '';
                            //taxListLookup.trackingChange = true;
                            state.orderStatus = response?.data?.content?.data.orderStatus;
                            //state.orderStatus = String(response?.data?.content?.data.orderStatus ?? '');
                            state.showComplexDiv = true;

                            await methods.refreshPaymentSummary(state.id);

                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحفظ',
                                timer: 1000,
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
            onMainModalHidden: () => {
                state.errors.orderDate = '';
                state.errors.employeeId = '';
                //state.errors.taxId = '';
                state.errors.orderStatus = '';
                //taxListLookup.trackingChange = false;
            }
        };
        const departmentListLookup = {
            obj: null,
            create: () => {
                if (Array.isArray(state.departmentListLookupData)) {
                    departmentListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.departmentListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'اختر الإدارة',
                        allowFiltering: true,
                        sortOrder: 'Ascending',

                        change: async (e) => {
                            state.departmentId = e.value;

                          
                            if (e.isInteracted) {
                                state.employeeId = null;

                                const filtered = state.employeeListLookupData
                                    .filter(emp => emp.departmentId === e.value);

                                employeeListLookup.obj.dataSource = filtered;
                                employeeListLookup.obj.dataBind();
                                employeeListLookup.obj.value = null;
                            }
                        }

                    });

                    departmentListLookup.obj.appendTo(departmentIdRef.value);
                }
            },
            refresh: () => {
                if (departmentListLookup.obj) {
                    departmentListLookup.obj.value = state.departmentId;
                }
            }
        };

        const employeeListLookup = {
            obj: null,
            create: () => {
                if (state.employeeListLookupData && Array.isArray(state.employeeListLookupData)) {
                    employeeListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.employeeListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'اختر موظف',
                        filterBarPlaceholder: 'Search',
                        sortOrder: 'Ascending',
                        allowFiltering: true,
                        filtering: (e) => {
                            e.preventDefaultAction = true;
                            let query = new ej.data.Query();
                            if (e.text !== '') {
                                query = query.where('name', 'startsWith', e.text, true);
                            }
                            e.updateData(state.employeeListLookupData, query);
                        },
                        change: (e) => {
                            state.employeeId = e.value;
                        }
                    });
                    employeeListLookup.obj.appendTo(employeeIdRef.value);
                }
            },
            refresh: () => {
                if (employeeListLookup.obj) {
                    employeeListLookup.obj.value = state.employeeId;
                }
            }

        };

        //const taxListLookup = {
        //    obj: null,
        //    trackingChange: false,
        //    create: () => {
        //        if (state.taxListLookupData && Array.isArray(state.taxListLookupData)) {
        //            taxListLookup.obj = new ej.dropdowns.DropDownList({
        //                dataSource: state.taxListLookupData,
        //                fields: { value: 'id', text: 'name' },
        //                placeholder: 'Select a Tax',
        //                change: async (e) => {
        //                    state.taxId = e.value;
        //                    if (e.isInteracted && taxListLookup.trackingChange) {
        //                        await methods.handleFormSubmit();
        //                    }
        //                }
        //            });
        //            taxListLookup.obj.appendTo(taxIdRef.value);
        //        }
        //    },
        //    refresh: () => {
        //        if (taxListLookup.obj) {
        //            taxListLookup.obj.value = state.taxId;
        //        }
        //    }
        //};

        const issueRequestsStatusListLookup = {
            obj: null,
            create: () => {
                if (state.issueRequestsStatusListLookupData && Array.isArray(state.issueRequestsStatusListLookupData)) {
                    issueRequestsStatusListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.issueRequestsStatusListLookupData,
                        //fields: { value: 'value', text: 'text' },
                        fields: { value: 'id', text: 'name' },


                        placeholder: 'اختر حالة الطلب',
                        change: (e) => {
                            state.orderStatus = e.value; 

                        }
                    });
                    issueRequestsStatusListLookup.obj.appendTo(orderStatusRef.value);
                }
            },
            refresh: () => {
                if (issueRequestsStatusListLookup.obj) {
                    issueRequestsStatusListLookup.obj.value = state.orderStatus;
                }
            }
        };

        const orderDatePicker = {
            obj: null,
            create: () => {
                orderDatePicker.obj = new ej.calendars.DatePicker({
                    format: 'yyyy-MM-dd',
                    value: state.orderDate ? new Date(state.orderDate) : null,
                    change: (e) => {
                        state.orderDate = e.value;
                    }
                });
                orderDatePicker.obj.appendTo(orderDateRef.value);
            },
            refresh: () => {
                if (orderDatePicker.obj) {
                    orderDatePicker.obj.value = state.orderDate ? new Date(state.orderDate) : null;
                }
            }
        };

        const numberText = {
            obj: null,
            create: () => {
                numberText.obj = new ej.inputs.TextBox({
                    placeholder: '[تلقائي]',
                    readonly: true
                });
                numberText.obj.appendTo(numberRef.value);
            }
        };

        Vue.watch(
            () => state.orderDate,
            (newVal, oldVal) => {
                orderDatePicker.refresh();
                state.errors.orderDate = '';
            }
        );
        Vue.watch(
            () => state.departmentId,
            () => {
                departmentListLookup.refresh();
                state.errors.departmentId = '';
            }
        );

        Vue.watch(
            () => state.employeeId,
            (newVal, oldVal) => {
                employeeListLookup.refresh();
                state.errors.employeeId = '';
            }
        );

        //Vue.watch(
        //    () => state.taxId,
        //    (newVal, oldVal) => {
        //        //taxListLookup.refresh();
        //        state.errors.taxId = '';
        //    }
        //);

        Vue.watch(
            () => state.orderStatus,
            (newVal, oldVal) => {
                issueRequestsStatusListLookup.refresh();
                state.errors.orderStatus = '';
                secondaryGrid.refresh();
            }
        );

        async function syncDepartmentAndEmployee(departmentId, employeeId) {
            // wait until employees are loaded
            while (!state.employeeListLookupData || state.employeeListLookupData.length === 0) {
                await new Promise(r => setTimeout(r, 50));
            }

            const filtered = state.employeeListLookupData
                .filter(e => e.departmentId === departmentId);

            employeeListLookup.obj.dataSource = filtered;
            employeeListLookup.obj.dataBind();

            // IMPORTANT: wait for databind cycle
            requestAnimationFrame(() => {
                employeeListLookup.obj.value = employeeId;
            });
        }



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
                    groupSettings: { columns: ['employeeName'] },
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
                        { field: 'number', headerText: 'رقم الطلب', width: 150, minWidth: 150 },
                        { field: 'orderDate', headerText: 'تاريخ الطلب', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'departmentName', headerText: 'الادارة', width: 200, minWidth: 200 },
                        { field: 'employeeName', headerText: 'الموظف', width: 200, minWidth: 200 },
                       
                        { field: 'orderStatusName', headerText: 'الحالة', width: 150, minWidth: 150 },
                        //{ field: 'taxName', headerText: 'الضريبة', width: 150, minWidth: 150 },
                        { field: 'afterTaxAmount', headerText: 'الإجمالي', width: 150, minWidth: 150, format: 'N2' },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء (UTC)', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'MainGrid_excelexport' },
                        'Search',
                        { type: 'Separator' },
                        { text: 'إضافة', tooltipText: 'إضافة', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'تعديل', tooltipText: 'تعديل', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'حذف', tooltipText: 'حذف', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                        { text: 'طباعة PDF', tooltipText: 'طباعة PDF', id: 'PrintPDFCustom' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'PrintPDFCustom'], false);
                        mainGrid.obj.autoFitColumns(['number', 'orderDate', 'employeeName', 'orderStatusName', 'taxName', 'afterTaxAmount', 'createdAtUtc']);
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
                            state.mainTitle = 'إضافة طلب مبيعات';
                            resetFormState();
                            state.secondaryData = [];
                            secondaryGrid.refresh();
                            state.showComplexDiv = false;
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;

                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];

                                state.mainTitle = 'تعديل طلب وإذن الصرف';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.orderDate = selectedRecord.orderDate ? new Date(selectedRecord.orderDate) : null;
                                state.description = selectedRecord.description ?? '';
                                state.employeeId = selectedRecord.employeeId ?? '';
                                state.orderStatus = selectedRecord.orderStatus;
                               // state.orderStatus = String(selectedRecord.orderStatus ?? '');
                                state.departmentId = selectedRecord.departmentId ?? null;
                                state.showComplexDiv = true;

                                
                                secondaryGrid.isRowEditing = false;

                              
                                if (secondaryGrid.obj) {
                                    secondaryGrid.obj.hideColumns(['availableQuantity']);
                                }


                                departmentListLookup.obj.value = state.departmentId;
                                await syncDepartmentAndEmployee(state.departmentId, state.employeeId);

                                await methods.populateSecondaryData(selectedRecord.id);
                                secondaryGrid.refresh();

                                mainModal.obj.show();
                            }
                        }


                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'حذف طلب المبيعات؟';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.orderDate = selectedRecord.orderDate ? new Date(selectedRecord.orderDate) : null;
                                state.description = selectedRecord.description ?? '';
                               state.employeeId = selectedRecord.employeeId ?? '';
                                // state.taxId = selectedRecord.taxId ?? '';
                                state.orderStatus = selectedRecord.orderStatus; // already string enum

                                //state.orderStatus = String(selectedRecord.orderStatus ?? '');
                                state.showComplexDiv = false;

                                state.departmentId = selectedRecord.departmentId ?? null;

                                // فلترة الموظفين حسب الإدارة
                                const filtered = state.employeeListLookupData
                                    .filter(emp => emp.departmentId === state.departmentId);

                                employeeListLookup.obj.dataSource = filtered;
                                employeeListLookup.obj.value = state.employeeId;



                                await methods.populateSecondaryData(selectedRecord.id);
                                secondaryGrid.refresh();

                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'PrintPDFCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                window.open('/IssueRequests/IssueRequestsPdf?id=' + (selectedRecord.id ?? ''), '_blank');
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


        //async function loadStock(rowData) {

        //    if (!isDraft.value) return;

        //    if (!rowData.productId || !rowData.warehouseId) {
        //        rowData.availableQuantity = 0;
        //        if (availableQuantityObj) availableQuantityObj.value = 0;
        //        return;
        //    }

        //    const res = await AxiosManager.get(
        //        `/IssueRequests/GetProductCurrentStock?productId=${rowData.productId}&warehouseId=${rowData.warehouseId}`
        //    );

        //    let stock = res.data?.content?.data?.currentStock ?? 0;

        //    // subtract supplied quantities INSIDE this request
        //    const suppliedInRequest = state.secondaryData
        //        .filter(item =>
        //            item.productId === rowData.productId &&
        //            item.warehouseId === rowData.warehouseId &&
        //            item.id !== rowData.id
        //        )
        //        .reduce((sum, item) => sum + (item.suppliedQuantity ?? 0), 0);

        //    stock -= suppliedInRequest;

    
        //    rowData.availableQuantity = stock;

          
        //    if (availableQuantityObj)
        //        availableQuantityObj.value = stock;
        //}

        async function loadStock(rowData) {

            if (!isDraft.value) return;

            if (!rowData.productId || !rowData.warehouseId) {
                rowData.availableQuantity = 0;

                if (availableQuantityObj)
                    availableQuantityObj.value = 0;

                return;
            }

            const res = await AxiosManager.get(
                `/IssueRequests/GetProductCurrentStock?productId=${rowData.productId}&warehouseId=${rowData.warehouseId}`
            );

            let stock = res.data?.content?.data?.currentStock ?? 0;

            // subtract supplied quantities INSIDE this request
            const suppliedInRequest = state.secondaryData
                .filter(item =>
                    item.productId === rowData.productId &&
                    item.warehouseId === rowData.warehouseId &&
                    item.id !== rowData.id
                )
                .reduce((sum, item) => sum + (item.suppliedQuantity ?? 0), 0);

            stock -= suppliedInRequest;

            // ✅ UPDATE ROW DATA
            rowData.availableQuantity = stock;

            // ✅ FORCE UPDATE INPUT
            if (availableQuantityObj) {
                availableQuantityObj.value = stock;
                availableQuantityObj.dataBind(); // 🔥 THIS IS THE KEY
            }
        }


      

        function getAvailableProducts(currentRow) {
            return state.productListLookupData.filter(p => {
                return !state.secondaryData.some(item =>
                    item.productId === p.id &&
                    item.warehouseId === currentRow.warehouseId &&
                    item.id !== currentRow.id 
                );
            });
        }

        // ثانوي (Secondary Grid)
        const secondaryGrid = {

            obj: null,
            isRowEditing: false,

            create: async (dataSource) => {

                secondaryGrid.obj = new ej.grids.Grid({
                    height: 400,
                    locale: 'ar',        
                    enableRtl: true,    
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
                        { field: 'id', isPrimaryKey: true, visible: false },

                        /* ================= Warehouse ================= */
                        {
                            field: 'warehouseId',
                            headerText: 'المخزن',
                            width: 220,
                            validationRules: { required: true },

                            valueAccessor: (field, data) => {
                                const id = String(data[field]);
                                const w = state.warehouseListLookupData
                                    .find(x => String(x.id) === id);
                                return w ? w.name : '';
                            },

                            edit: {
                                create: () => document.createElement('input'),
                                read: () => warehouseObj.value,
                                destroy: () => warehouseObj.destroy(),
                                write: (args) => {

                                    warehouseObj = new ej.dropdowns.DropDownList({
                                        dataSource: state.warehouseListLookupData,
                                        fields: { value: 'id', text: 'name' },
                                        value: args.rowData.warehouseId ?? null,
                                        placeholder: 'اختر المخزن',
                                        allowFiltering: true,

                                        change: (e) => {
                                            args.rowData.warehouseId = e.value; 

                                            if (productObj) {
                                                productObj.value = null;
                                                productObj.dataSource = getAvailableProducts(args.rowData);
                                            }

                                            args.rowData.productId = null;
                                            loadStock(args.rowData);
                                        }
                                    });

                                    warehouseObj.appendTo(args.element);
                                }
                            }
                        },


                        /* ================= Product ================= */
                        {
                            field: 'productId',
                            headerText: 'المنتج',
                            width: 250,
                            validationRules: { required: true },

                           
                            valueAccessor: (field, data) => {
                                const p = state.productListLookupData.find(x => x.id === data[field]);
                                return p ? p.name : '';
                            },

                            edit: {
                                create: () => document.createElement('input'),
                                read: () => productObj.value,
                                destroy: () => productObj.destroy(),
                                write: (args) => {

                                    const filteredProducts = getAvailableProducts(args.rowData);

                                    productObj = new ej.dropdowns.DropDownList({
                                        dataSource: filteredProducts,
                                        fields: { text: 'name', value: 'id' },
                                        value: args.rowData.productId ?? null,
                                        allowFiltering: true,
                                        placeholder: 'اختر المنتج',
                                        change: async (e) => {
                                            const product = state.productListLookupData.find(x => x.id === e.value);
                                            if (!product) return;

                                            args.rowData.productId = product.id;

                                         
                                            if (priceObj) priceObj.value = product.unitPrice ?? 0;

                                            
                                            if (summaryObj) summaryObj.value = product.description;
                                            if (numberObj) numberObj.value = product.number;

                                         
                                            if (requestedQtyObj)
                                                requestedQtyObj.value = args.rowData.requestedQuantity ?? null;

                                            
                                            await loadStock(args.rowData);
                                        }
                                    });

                                    productObj.appendTo(args.element);
                                }
                            }
                        },



                        /* ================= Unit Price ================= */
                        {
                            field: 'unitPrice',
                            headerText: 'سعر الوحدة',
                            width: 180,
                            type: 'number',
                            format: 'N2',
                            validationRules: { required: true },
                            edit: {
                                create: () => document.createElement('input'),
                                read: () => priceObj.value,
                                destroy: () => priceObj.destroy(),
                                write: (args) => {
                                    priceObj = new ej.inputs.NumericTextBox({
                                        value: args.rowData.unitPrice ?? 0,
                                        change: () => loadStock(args.rowData)
                                    });
                                    priceObj.appendTo(args.element);
                                }
                            }
                        },

                        /* ================= Available Quantity (READ ONLY) ================= */
                        //{
                        //    field: 'availableQuantity',
                        //    headerText: 'المتاح بالمخزن',
                        //    width: 180,
                        //    visible: false,         
                        //    allowEditing: true      
                      
                        //},

                        {
                            field: 'availableQuantity',
                            headerText: 'المتاح بالمخزن',
                            width: 180,
                            allowEditing: false,
                            edit: {
                                create: () => document.createElement('input'),
                                write: (args) => {

                                    const td = args.element.closest('td');

                                    if (!secondaryGrid.isRowEditing) {
                                        td.style.display = 'none';
                                        return;
                                    }

                                    td.style.display = '';

                                    availableQuantityObj = new ej.inputs.NumericTextBox({
                                        value: args.rowData.availableQuantity ?? 0,
                                        readonly: true,
                                        enabled: false
                                    });

                                    availableQuantityObj.appendTo(args.element);
                                }
                            }

                        },



                        /* ================= Requested ================= */
                        {
                            field: 'requestedQuantity',
                            headerText: 'الكمية المطلوبة',
                            width: 180,
                            validationRules: { required: true },
                            edit: {
                                create: () => document.createElement('input'),
                                read: () => requestedQtyObj.value,
                                destroy: () => requestedQtyObj.destroy(),
                                write: (args) => {
                                    requestedQtyObj = new ej.inputs.NumericTextBox({
                                        value: args.rowData.requestedQuantity ,
                                        change: () => loadStock(args.rowData)
                                    });
                                    requestedQtyObj.appendTo(args.element);
                                }
                            }
                        },

                        /* ================= Supplied ================= */
                        {
                            field: 'suppliedQuantity',
                            headerText: 'الكمية المصروفة',
                            width: 180,
                            validationRules: { required: true },
                            edit: {
                                create: () => document.createElement('input'),
                                read: () => suppliedQtyObj.value,
                                destroy: () => suppliedQtyObj.destroy(),
                                write: (args) => {
                                    suppliedQtyObj = new ej.inputs.NumericTextBox({
                                        value: args.rowData.suppliedQuantity ?? 0
                                    });
                                    suppliedQtyObj.appendTo(args.element);
                                }
                            }
                        },

                        /* ================= Total ================= */
                        {
                            field: 'total',
                            headerText: 'الإجمالي',
                            width: 180,
                            allowEditing: false,
                            edit: {
                                create: () => document.createElement('input'),
                                write: (args) => {
                                    totalObj = new ej.inputs.NumericTextBox({
                                        value: args.rowData.total ?? 0,
                                        readonly: true
                                    });
                                    totalObj.appendTo(args.element);
                                }
                            }
                        },

                        /* ================= Product Number ================= */
                        {
                            field: 'productNumber',
                            headerText: 'رقم المنتج',
                            width: 180,
                            allowEditing: false
                        },

                        /* ================= Summary ================= */
                        {
                            field: 'summary',
                            headerText: 'وصف المنتج',
                            width: 220
                        }
                    ],

                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'secondaryGrid_excelexport' },
                      /*  'ExcelExport',*/
                        { type: 'Separator' },
                        'Add',
                        'Edit',
                        'Delete',
                        'Update',
                        'Cancel'
                    ],
                    /*toolbar: ['ExcelExport', { type: 'Separator' }, 'Add', 'Edit', 'Delete', 'Update', 'Cancel'],*/
                    beforeDataBound: () => { },
                    dataBound: () => { },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (secondaryGrid.obj.getSelectedRecords().length == 1) secondaryGrid.obj.toolbarModule.enableItems(['Edit'], true);
                        else secondaryGrid.obj.toolbarModule.enableItems(['Edit'], false);
                    },
                    rowDeselected: () => {
                        if (secondaryGrid.obj.getSelectedRecords().length == 1) secondaryGrid.obj.toolbarModule.enableItems(['Edit'], true);
                        else secondaryGrid.obj.toolbarModule.enableItems(['Edit'], false);
                    },
                    rowSelecting: () => {
                        if (secondaryGrid.obj.getSelectedRecords().length) secondaryGrid.obj.clearSelection();
                    },
                    toolbarClick: (args) => {
                        if (args.item.id === 'SecondaryGrid_excelexport') secondaryGrid.obj.excelExport();
                    },
            
                    actionBegin: async (args) => {
                        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
                            secondaryGrid.isRowEditing = true;

                            // ⏱️ انتظر editor يتخلق
                            requestAnimationFrame(async () => {
                                await loadStock(args.rowData);
                            });
                        }
                    },



                    actionComplete: (args) => {
                        if (args.requestType === 'save' || args.requestType === 'cancel') {
                            secondaryGrid.isRowEditing = false;
                        }
                    }





                   
                });
                secondaryGrid.obj.appendTo(secondaryGridRef.value);
            },

            refresh: () => {
                if (!secondaryGrid.obj) return;

                secondaryGrid.obj.setProperties({
                    dataSource: state.secondaryData,
                    editSettings: {
                        allowEditing: isDraft.value,
                        allowAdding: isDraft.value,
                        allowDeleting: isDraft.value
                    }
                });

                //const col = secondaryGrid.obj.getColumnByField('availableQuantity');
                //if (col) {
                //    col.visible = secondaryGrid.isRowEditing;
                //    secondaryGrid.obj.refreshColumns();
                //}
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

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['IssueRequests']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden);

                await methods.populateDepartmentListLookupData();
                departmentListLookup.create();

                await methods.populateEmployeeListLookupData();
                employeeListLookup.create();

                await methods.populateWarehouseListLookupData();

               // await methods.populateTaxListLookupData();
                //taxListLookup.create();
                await methods.populateIssueRequestsStatusListLookupData();
                issueRequestsStatusListLookup.create();
                orderDatePicker.create();
                numberText.create();
                await methods.populateProductListLookupData();
                await secondaryGrid.create(state.secondaryData);
            } catch (e) {
                console.error('page init error:', e);
            } finally {
                
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', methods.onMainModalHidden);
        });

        return {
            mainGridRef,
            mainModalRef,
            orderDateRef,
            numberRef,
            employeeIdRef,
            departmentIdRef,
            //taxIdRef,
            orderStatusRef,
            secondaryGridRef,
            state,
            methods,
            handler: {
                handleSubmit: methods.handleFormSubmit
            }
        };
    }
};

Vue.createApp(App).mount('#app');