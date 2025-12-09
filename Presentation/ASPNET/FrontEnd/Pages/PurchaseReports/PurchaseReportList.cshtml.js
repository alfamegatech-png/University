ej.base.L10n.load({
    "ar": {
        "grid": {
            "EmptyRecord": "لا توجد بيانات",
            "True": "نعم",
            "False": "لا",
            "Add": "إضافة",
            "Edit": "تعديل",
            "Cancel": "إلغاء",
            "Update": "حفظ",
            "Delete": "حذف",
            "Print": "طباعة",
            "Pdfexport": "تصدير PDF",
            "Excelexport": "تصدير Excel",
            "Search": "بحث",
            "FilterButton": "تطبيق",
            "ClearButton": "مسح",
            "StartsWith": "يبدأ بـ",
            "EndsWith": "ينتهي بـ",
            "Contains": "يحتوي",
            "Equal": "يساوي",
            "NotEqual": "لا يساوي",
            "LessThan": "أقل من",
            "LessThanOrEqual": "أقل من أو يساوي",
            "GreaterThan": "أكبر من",
            "GreaterThanOrEqual": "أكبر من أو يساوي",
            "ChooseDate": "اختر التاريخ",
            "EnterValue": "أدخل القيمة",
            "GroupDropArea": "اسحب رأس العمود هنا للتجميع",
            "Ungroup": "إلغاء التجميع",
            "GroupDisable": "التجميع غير متاح لهذا العمود",
            "NoResult": "لا توجد نتائج مطابقة",
            "PagerInfo": "عرض {0} إلى {1} من {2} سجل",
            "All": "الكل",
            "PageSize": "عدد الصفوف",
            "CurrentPageInfo": "صفحة {0} من {1}",
            "TotalItemsInfo": "({0} عناصر)",
            "FirstPageTooltip": "الصفحة الأولى",
            "LastPageTooltip": "الصفحة الأخيرة",
            "NextPageTooltip": "التالي",
            "PreviousPageTooltip": "السابق",
            "ExcelExport": "تصدير Excel",
            "PdfExport": "تصدير PDF",
            "CsvExport": "تصدير CSV"
        },
        "pager": {
            "currentPageInfo": "صفحة {0} من {1}",
            "totalItemsInfo": "({0} سجل)",
            "firstPageTooltip": "الصفحة الأولى",
            "lastPageTooltip": "الصفحة الأخيرة",
            "nextPageTooltip": "التالي",
            "previousPageTooltip": "السابق",
            "pagerDropDown": "عدد الصفوف",
            "pagerAll": "الكل"
        }
    }
});


const App = {
    setup() {
        const state = Vue.reactive({
            mainData: []
        });

        const mainGridRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/PurchaseOrderItem/GetPurchaseOrderItemList', {});
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
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
        };

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    locale: "ar",
                    enableRtl: true,
                    height: '240px',
                    dataSource: dataSource,
                    allowFiltering: true,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: true,
                    groupSettings: {
                        columns: ['purchaseOrderNumber']
                    },
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'purchaseOrderNumber', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "الكل"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',

                    // ----- الأعمدة بعد التعريب -----
                    columns: [
                        { type: 'checkbox', width: 60 },

                        { field: 'id', isPrimaryKey: true, headerText: 'المعرف', visible: false },

                        { field: 'vendorName', headerText: 'المورد', width: 200, minWidth: 200 },
                        { field: 'purchaseOrderNumber', headerText: 'رقم أمر الشراء', width: 200, minWidth: 200 },
                        { field: 'productNumber', headerText: 'رقم المنتج', width: 200, minWidth: 200 },
                        { field: 'productName', headerText: 'اسم المنتج', width: 200, minWidth: 200 },
                        { field: 'unitPrice', headerText: 'سعر الوحدة', width: 150, minWidth: 150, format: 'N2' },
                        { field: 'quantity', headerText: 'الكمية', width: 150, minWidth: 150 },
                        { field: 'total', headerText: 'الإجمالي', width: 150, minWidth: 150, format: 'N2' },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء (UTC)', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],

                    // ----- الإجماليات بعد التعريب -----
                    aggregates: [
                        {
                            columns: [
                                {
                                    type: 'Sum',
                                    field: 'total',
                                    groupCaptionTemplate: 'الإجمالي: ${Sum}',
                                    format: 'N2'
                                }
                            ]
                        }
                    ],

                    // ----- التولبار بعد التعريب -----
                    toolbar: [
                        {
                            text: "تصدير إكسل",
                            tooltipText: "تصدير إلى Excel",
                            prefixIcon: "e-excelexport",
                            id: "MainGrid_excelexport"
                        },
                        "Search",
                        { type: "Separator" }
                    ],

                    dataBound: function () {
                        mainGrid.obj.autoFitColumns([
                            'vendorName',
                            'purchaseOrderNumber',
                            'productNumber',
                            'productName',
                            'unitPrice',
                            'quantity',
                            'total',
                            'createdAtUtc'
                        ]);
                    },

                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) {
                            mainGrid.obj.clearSelection();
                        }
                    },

                    toolbarClick: (args) => {
                        if (args.item.id === 'MainGrid_excelexport') {
                            mainGrid.obj.excelExport();
                        }
                    }
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },

            refresh: () => {
                mainGrid.obj.setProperties({ dataSource: state.mainData });
            }
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['PurchaseReports']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                await mainGrid.create(state.mainData);
            } catch (e) {
                console.error('خطأ في تحميل الصفحة:', e);
            }
        });

        return {
            mainGridRef,
            state,
        };
    }
};

Vue.createApp(App).mount('#app');
