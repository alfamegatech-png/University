const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            mainTitle: 'Edit Company',
            id: '',
            name: '',
            description: '',
            currency: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phoneNumber: '',
            faxNumber: '',
            emailAddress: '',
            website: '',
            errors: {
                name: '',
                currency: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                phoneNumber: '',
                emailAddress: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);
        const currencyRef = Vue.ref(null);
        const streetRef = Vue.ref(null);
        const cityRef = Vue.ref(null);
        const stateRef = Vue.ref(null);
        const zipCodeRef = Vue.ref(null);
        const countryRef = Vue.ref(null);
        const phoneNumberRef = Vue.ref(null);
        const faxNumberRef = Vue.ref(null);
        const emailAddressRef = Vue.ref(null);
        const websiteRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Company/GetCompanyList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (
                id, name, description, currency, street, city, state, zipCode, country,
                phoneNumber, faxNumber, emailAddress, website, updatedById
            ) => {
                try {
                    const response = await AxiosManager.post('/Company/UpdateCompany', {
                        id,
                        name,
                        description,
                        currency,
                        street,
                        city,
                        state,
                        zipCode,
                        country,
                        phoneNumber,
                        faxNumber,
                        emailAddress,
                        website,
                        updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
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
                        {
                            field: 'id',
                            isPrimaryKey: true,
                            headerText: 'المعرف',
                            visible: false
                        },
                        { field: 'name', headerText: 'اسم الشركة', width: 150, minWidth: 150 },
                        { field: 'currency', headerText: 'العملة', width: 150, minWidth: 150 },
                        { field: 'street', headerText: 'الشارع', width: 150, minWidth: 150 },
                        { field: 'phoneNumber', headerText: 'رقم الهاتف', width: 150, minWidth: 150 },
                        { field: 'emailAddress', headerText: 'البريد الإلكتروني', width: 150, minWidth: 150 },
                        { field: 'createdAtUtc', headerText: 'تاريخ الإنشاء (UTC)', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],

                    toolbar: [
                        'ExcelExport',
                        'Search',
                        { type: 'Separator' },
                        {
                            text: 'تعديل',
                            tooltipText: 'تعديل البيانات',
                            prefixIcon: 'e-edit',
                            id: 'EditCustom'
                        },
                        { type: 'Separator' },
                    ],

                    beforeDataBound: () => { },

                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom'], false);
                        mainGrid.obj.autoFitColumns([
                            'name',
                            'currency',
                            'street',
                            'phoneNumber',
                            'emailAddress',
                            'createdAtUtc'
                        ]);
                    },

                    excelExportComplete: () => { },

                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length === 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], false);
                        }
                    },

                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length === 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom'], false);
                        }
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

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;

                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];

                                state.id = selectedRecord.id ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.currency = selectedRecord.currency ?? '';
                                state.street = selectedRecord.street ?? '';
                                state.city = selectedRecord.city ?? '';
                                state.state = selectedRecord.state ?? '';
                                state.zipCode = selectedRecord.zipCode ?? '';
                                state.country = selectedRecord.country ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.faxNumber = selectedRecord.faxNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.website = selectedRecord.website ?? '';

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

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                const formattedData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
                state.mainData = formattedData;
            },
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

        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل اسم الشركة',
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) {
                    nameText.obj.value = state.name;
                }
            }
        };

        const currencyText = {
            obj: null,
            create: () => {
                currencyText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل العملة',
                });
                currencyText.obj.appendTo(currencyRef.value);
            },
            refresh: () => {
                if (currencyText.obj) {
                    currencyText.obj.value = state.currency;
                }
            }
        };

        const streetText = {
            obj: null,
            create: () => {
                streetText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل اسم الشارع',
                });
                streetText.obj.appendTo(streetRef.value);
            },
            refresh: () => {
                if (streetText.obj) {
                    streetText.obj.value = state.street;
                }
            }
        };

        const cityText = {
            obj: null,
            create: () => {
                cityText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل اسم المدينة',
                });
                cityText.obj.appendTo(cityRef.value);
            },
            refresh: () => {
                if (cityText.obj) {
                    cityText.obj.value = state.city;
                }
            }
        };

        const stateText = {
            obj: null,
            create: () => {
                stateText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل المحافظة / الولاية',
                });
                stateText.obj.appendTo(stateRef.value);
            },
            refresh: () => {
                if (stateText.obj) {
                    stateText.obj.value = state.state;
                }
            }
        };

        const zipCodeText = {
            obj: null,
            create: () => {
                zipCodeText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل الرمز البريدي',
                });
                zipCodeText.obj.appendTo(zipCodeRef.value);
            },
            refresh: () => {
                if (zipCodeText.obj) {
                    zipCodeText.obj.value = state.zipCode;
                }
            }
        };

        const countryText = {
            obj: null,
            create: () => {
                countryText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل الدولة',
                });
                countryText.obj.appendTo(countryRef.value);
            },
            refresh: () => {
                if (countryText.obj) {
                    countryText.obj.value = state.country;
                }
            }
        };

        const phoneNumberText = {
            obj: null,
            create: () => {
                phoneNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل رقم الهاتف',
                });
                phoneNumberText.obj.appendTo(phoneNumberRef.value);
            },
            refresh: () => {
                if (phoneNumberText.obj) {
                    phoneNumberText.obj.value = state.phoneNumber;
                }
            }
        };

        const faxNumberText = {
            obj: null,
            create: () => {
                faxNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل رقم الفاكس',
                });
                faxNumberText.obj.appendTo(faxNumberRef.value);
            },
            refresh: () => {
                if (faxNumberText.obj) {
                    faxNumberText.obj.value = state.faxNumber;
                }
            }
        };

        const emailAddressText = {
            obj: null,
            create: () => {
                emailAddressText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل البريد الإلكتروني',
                });
                emailAddressText.obj.appendTo(emailAddressRef.value);
            },
            refresh: () => {
                if (emailAddressText.obj) {
                    emailAddressText.obj.value = state.emailAddress;
                }
            }
        };

        const websiteText = {
            obj: null,
            create: () => {
                websiteText.obj = new ej.inputs.TextBox({
                    placeholder: 'أدخل الموقع الإلكتروني',
                });
                websiteText.obj.appendTo(websiteRef.value);
            },
            refresh: () => {
                if (websiteText.obj) {
                    websiteText.obj.value = state.website;
                }
            }
        };

        // Watchers
        Vue.watch(
            () => state.name,
            () => {
                state.errors.name = '';
                nameText.refresh();
            }
        );

        Vue.watch(
            () => state.currency,
            () => {
                state.errors.currency = '';
                currencyText.refresh();
            }
        );

        Vue.watch(
            () => state.street,
            () => {
                state.errors.street = '';
                streetText.refresh();
            }
        );

        Vue.watch(
            () => state.city,
            () => {
                state.errors.city = '';
                cityText.refresh();
            }
        );

        Vue.watch(
            () => state.state,
            () => {
                state.errors.state = '';
                stateText.refresh();
            }
        );

        Vue.watch(
            () => state.zipCode,
            () => {
                state.errors.zipCode = '';
                zipCodeText.refresh();
            }
        );

        Vue.watch(
            () => state.country,
            () => {
                countryText.refresh();
            }
        );

        Vue.watch(
            () => state.phoneNumber,
            () => {
                state.errors.phoneNumber = '';
                phoneNumberText.refresh();
            }
        );

        Vue.watch(
            () => state.faxNumber,
            (newVal, oldVal) => {
                faxNumberText.refresh();
            }
        );

        Vue.watch(
            () => state.emailAddress,
            (newVal, oldVal) => {
                state.errors.emailAddress = '';
                emailAddressText.refresh();
            }
        );

        Vue.watch(
            () => state.website,
            (newVal, oldVal) => {
                websiteText.refresh();
            }
        );

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 200));

                    // Validation
                    let isValid = true;
                    Object.keys(state.errors).forEach(field => {
                        state.errors[field] = '';
                        if (!state[field] && ['name', 'currency', 'street', 'city', 'state', 'zipCode', 'phoneNumber', 'emailAddress'].includes(field)) {
                            // تحويل اسم الحقل إلى نص عربي للرسائل
                            const fieldNamesAr = {
                                name: 'اسم الشركة',
                                currency: 'العملة',
                                street: 'الشارع',
                                city: 'المدينة',
                                state: 'المحافظة / الولاية',
                                zipCode: 'الرمز البريدي',
                                phoneNumber: 'رقم الهاتف',
                                emailAddress: 'البريد الإلكتروني'
                            };
                            state.errors[field] = `${fieldNamesAr[field]} مطلوب.`;
                            isValid = false;
                        }
                    });

                    if (!isValid) return;

                    const response = await services.updateMainData(
                        state.id,
                        state.name,
                        state.description,
                        state.currency,
                        state.street,
                        state.city,
                        state.state,
                        state.zipCode,
                        state.country,
                        state.phoneNumber,
                        state.faxNumber,
                        state.emailAddress,
                        state.website,
                        StorageManager.getUserId()
                    );

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();
                        Swal.fire({
                            icon: 'success',
                            title: state.deleteMode ? 'تم الحذف' : 'تم الحفظ',
                            text: 'سيتم تحديث الصفحة...',
                            timer: 1000,
                            showConfirmButton: false
                        });

                        setTimeout(() => {
                            mainModal.obj.hide();
                            location.reload();
                        }, 1000);

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
                        confirmButtonText: 'حسناً'
                    });
                } finally {
                    state.isSubmitting = false;
                }
            },
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['Companies']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                nameText.create();
                currencyText.create();
                streetText.create();
                cityText.create();
                stateText.create();
                zipCodeText.create();
                countryText.create();
                phoneNumberText.create();
                faxNumberText.create();
                emailAddressText.create();
                websiteText.create();

                mainModal.create();

                mainModalRef.value.addEventListener('hidden.bs.modal', () => {
                    Object.keys(state).forEach(key => {
                        if (typeof state[key] === 'string') {
                            state[key] = '';
                        }
                    });
                    state.errors = {
                        name: '',
                        currency: '',
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        phoneNumber: '',
                        emailAddress: ''
                    };
                });
            } catch (e) {
                console.error('خطأ أثناء تهيئة الصفحة:', e);
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', () => { });
        });

        return {
            state,
            mainGridRef,
            mainModalRef,
            nameRef,
            currencyRef,
            streetRef,
            cityRef,
            stateRef,
            zipCodeRef,
            countryRef,
            phoneNumberRef,
            faxNumberRef,
            emailAddressRef,
            websiteRef,
            handler
        };

    }
};

Vue.createApp(App).mount('#app');