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
            vendorListLookupData: [],
            mainTitle: null,
            id: '',
            name: '',
            jobTitle: '',
            phoneNumber: '',
            emailAddress: '',
            description: '',
            vendorId: null,
            errors: {
                name: '',
                jobTitle: '',
                phoneNumber: '',
                emailAddress: '',
                vendorId: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const jobTitleRef = Vue.ref(null);
        const phoneNumberRef = Vue.ref(null);
        const emailAddressRef = Vue.ref(null);
        const vendorIdRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.name = '';
            state.errors.jobTitle = '';
            state.errors.phoneNumber = '';
            state.errors.emailAddress = '';
            state.errors.vendorId = '';

            let isValid = true;

            if (!state.name) {
                state.errors.name = 'الاسم مطلوب.';
                isValid = false;
            }
            if (!state.jobTitle) {
                state.errors.jobTitle = 'المسمى الوظيفي مطلوب.';
                isValid = false;
            }
            if (!state.phoneNumber) {
                state.errors.phoneNumber = 'رقم الهاتف مطلوب.';
                isValid = false;
            }
            if (!state.emailAddress) {
                state.errors.emailAddress = 'البريد الإلكتروني مطلوب.';
                isValid = false;
            }
            if (!state.vendorId) {
                state.errors.vendorId = 'المورد مطلوب.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.name = '';
            state.number = '';
            state.jobTitle = '';
            state.phoneNumber = '';
            state.emailAddress = '';
            state.description = '';
            state.vendorId = null;
            state.errors = {
                name: '',
                jobTitle: '',
                phoneNumber: '',
                emailAddress: '',
                vendorId: ''
            };
        };

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/VendorContact/GetVendorContactList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (name, jobTitle, phoneNumber, emailAddress, description, vendorId, createdById) => {
                try {
                    const response = await AxiosManager.post('/VendorContact/CreateVendorContact', {
                        name, jobTitle, phoneNumber, emailAddress, description, vendorId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, name, jobTitle, phoneNumber, emailAddress, description, vendorId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/VendorContact/UpdateVendorContact', {
                        id, name, jobTitle, phoneNumber, emailAddress, description, vendorId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/VendorContact/DeleteVendorContact', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getVendorListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Vendor/GetVendorList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            }
        };

        const methods = {
            populateVendorListLookupData: async () => {
                const response = await services.getVendorListLookupData();
                state.vendorListLookupData = response?.data?.content?.data;
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
        };

        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل الاسم'
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) {
                    nameText.obj.value = state.name;
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
            },
            refresh: () => {
                if (numberText.obj) {
                    numberText.obj.value = state.number;
                }
            }
        };

        const jobTitleText = {
            obj: null,
            create: () => {
                jobTitleText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل المسمى الوظيفي'
                });
                jobTitleText.obj.appendTo(jobTitleRef.value);
            },
            refresh: () => {
                if (jobTitleText.obj) {
                    jobTitleText.obj.value = state.jobTitle;
                }
            }
        };

        const phoneNumberText = {
            obj: null,
            create: () => {
                phoneNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل رقم الهاتف'
                });
                phoneNumberText.obj.appendTo(phoneNumberRef.value);
            },
            refresh: () => {
                if (phoneNumberText.obj) {
                    phoneNumberText.obj.value = state.phoneNumber;
                }
            }
        };

        const emailAddressText = {
            obj: null,
            create: () => {
                emailAddressText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل البريد الإلكتروني'
                });
                emailAddressText.obj.appendTo(emailAddressRef.value);
            },
            refresh: () => {
                if (emailAddressText.obj) {
                    emailAddressText.obj.value = state.emailAddress;
                }
            }
        };

        const vendorListLookup = {
            obj: null,
            create: () => {
                if (state.vendorListLookupData && Array.isArray(state.vendorListLookupData)) {
                    vendorListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.vendorListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'اختر المورد',
                        change: (e) => {
                            state.vendorId = e.value;
                        }
                    });
                    vendorListLookup.obj.appendTo(vendorIdRef.value);
                } else {
                    console.error('بيانات قائمة الموردين غير متاحة أو غير صحيحة.');
                }
            },
            refresh: () => {
                if (vendorListLookup.obj) {
                    vendorListLookup.obj.value = state.vendorId;
                }
            }
        };

        Vue.watch(() => state.name, () => {
            state.errors.name = '';
            nameText.refresh();
        });

        Vue.watch(() => state.jobTitle, () => {
            state.errors.jobTitle = '';
            jobTitleText.refresh();
        });

        Vue.watch(() => state.phoneNumber, () => {
            state.errors.phoneNumber = '';
            phoneNumberText.refresh();
        });

        Vue.watch(() => state.emailAddress, () => {
            state.errors.emailAddress = '';
            emailAddressText.refresh();
        });

        Vue.watch(() => state.vendorId, () => {
            state.errors.vendorId = '';
            vendorListLookup.refresh();
        });

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));

                    if (!validateForm()) return;

                    const response = state.id === ''
                        ? await services.createMainData(state.name, state.jobTitle, state.phoneNumber, state.emailAddress, state.description, state.vendorId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.name, state.jobTitle, state.phoneNumber, state.emailAddress, state.description, state.vendorId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        const successMessage = state.deleteMode ? 'تم الحذف بنجاح' : 'تم الحفظ بنجاح';
                        Swal.fire({
                            icon: 'success',
                            title: successMessage,
                            timer: 2000,
                            showConfirmButton: false
                        });

                        setTimeout(() => {
                            mainModal.obj.hide();
                            if (state.deleteMode) resetFormState();
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
            }
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['VendorContacts']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                await methods.populateVendorListLookupData();
                vendorListLookup.create();
                nameText.create();
                numberText.create();
                jobTitleText.create();
                phoneNumberText.create();
                emailAddressText.create();
                mainModal.create();

                mainModalRef.value?.addEventListener('hidden.bs.modal', () => resetFormState());

            } catch (e) {
                console.error('خطأ في تهيئة الصفحة:', e);
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', resetFormState);
        });

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
                    groupSettings: { columns: ['vendorName'] },
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
                        { field: 'number', headerText: 'الرقم', width: 150, minWidth: 150 },
                        { field: 'name', headerText: 'الاسم', width: 200, minWidth: 200 },
                        { field: 'vendorName', headerText: 'المورد', width: 150, minWidth: 150 },
                        { field: 'jobTitle', headerText: 'المسمى الوظيفي', width: 150, minWidth: 150 },
                        { field: 'phoneNumber', headerText: 'الهاتف', width: 150, minWidth: 150 },
                        { field: 'emailAddress', headerText: 'البريد الإلكتروني', width: 150, minWidth: 150 },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'MainGrid_ExcelExport' },
                        'Search',

                        { type: 'Separator' },
                        { text: 'إضافة', tooltipText: 'إضافة', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'تعديل', tooltipText: 'تعديل', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'حذف', tooltipText: 'حذف', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['name', 'vendorName', 'jobTitle', 'phoneNumber', 'emailAddress', 'createdAtUtc']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], mainGrid.obj.getSelectedRecords().length === 1);
                    },
                    rowDeselected: () => {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], mainGrid.obj.getSelectedRecords().length === 1);
                    },
                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) mainGrid.obj.clearSelection();
                    },
                    toolbarClick: async (args) => {
                        if (args.item.id === 'MainGrid_ExcelExport') mainGrid.obj.excelExport();

                        if (args.item.id === 'AddCustom') {
                            state.deleteMode = false;
                            state.mainTitle = 'إضافة جهة اتصال للمورد';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'تعديل جهة اتصال المورد';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.jobTitle = selectedRecord.jobTitle ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.vendorId = selectedRecord.vendorId ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'حذف جهة اتصال المورد؟';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.jobTitle = selectedRecord.jobTitle ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.vendorId = selectedRecord.vendorId ?? '';
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

        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, { backdrop: 'static', keyboard: false });
            }
        };

        return {
            mainGridRef,
            mainModalRef,
            nameRef,
            numberRef,
            jobTitleRef,
            phoneNumberRef,
            emailAddressRef,
            vendorIdRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');
