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
            userId: '',
            firstName: '',
            lastName: '',
            companyName: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            mainTitle: 'تعديل الملف الشخصي',
            changePasswordTitle: 'تغيير كلمة المرور',
            changeAvatarTitle: 'تغيير الصورة الشخصية',
            errors: {
                firstName: '',
                lastName: '',
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const changePasswordModalRef = Vue.ref(null);
        const changeAvatarModalRef = Vue.ref(null);
        const firstNameRef = Vue.ref(null);
        const lastNameRef = Vue.ref(null);
        const companyNameRef = Vue.ref(null);
        const oldPasswordRef = Vue.ref(null);
        const newPasswordRef = Vue.ref(null);
        const confirmNewPasswordRef = Vue.ref(null);
        const imageUploadRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Security/GetMyProfileList?userId=' + StorageManager.getUserId(), {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (userId, firstName, lastName, companyName) => {
                try {
                    const response = await AxiosManager.post('/Security/UpdateMyProfile', {
                        userId, firstName, lastName, companyName
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updatePasswordData: async (userId, oldPassword, newPassword, confirmNewPassword) => {
                try {
                    const response = await AxiosManager.post('/Security/UpdateMyProfilePassword', {
                        userId, oldPassword, newPassword, confirmNewPassword
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            uploadImage: async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const response = await AxiosManager.post('/FileImage/UploadImage', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateAvatarData: async (userId, avatar) => {
                try {
                    const response = await AxiosManager.post('/Security/UpdateMyProfileAvatar', { userId, avatar });
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
                    sortSettings: { columns: [{ field: 'firstName', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        { field: 'id', isPrimaryKey: true, headerText: 'معرّف', visible: false },
                        { field: 'firstName', headerText: 'الاسم الأول', width: 200, minWidth: 200 },
                        { field: 'lastName', headerText: 'اسم العائلة', width: 200, minWidth: 200 },
                        { field: 'companyName', headerText: 'اسم الشركة', width: 400, minWidth: 400 },
                    ],
                    toolbar: [
                        { text: 'تصدير إكسل', tooltipText: 'تصدير إلى Excel', prefixIcon: 'e-excelexport', id: 'MainGrid_excelexport' },
                        'Search',
                        { type: 'Separator' },
                        { text: 'تعديل', tooltipText: 'تعديل', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { type: 'Separator' },
                        { text: 'تغيير كلمة المرور', tooltipText: 'تغيير كلمة المرور', id: 'ChangePasswordCustom' },
                        { text: 'تغيير الصورة', tooltipText: 'تغيير الصورة', id: 'ChangeAvatarCustom' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'ChangePasswordCustom', 'ChangeAvatarCustom'], false);
                        mainGrid.obj.autoFitColumns(['firstName', 'lastName', 'companyName']);
                    },
                    rowSelected: () => {
                        const enable = mainGrid.obj.getSelectedRecords().length === 1;
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'ChangePasswordCustom', 'ChangeAvatarCustom'], enable);
                    },
                    rowDeselected: () => {
                        const enable = mainGrid.obj.getSelectedRecords().length === 1;
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'ChangePasswordCustom', 'ChangeAvatarCustom'], enable);
                    },
                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) mainGrid.obj.clearSelection();
                    },
                    toolbarClick: (args) => {
                        if (args.item.id === 'MainGrid_excelexport') mainGrid.obj.excelExport();
                        if (args.item.id === 'EditCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const record = mainGrid.obj.getSelectedRecords()[0];
                                state.userId = record.id ?? '';
                                state.firstName = record.firstName ?? '';
                                state.lastName = record.lastName ?? '';
                                state.companyName = record.companyName ?? '';
                                mainModal.obj.show();
                            }
                        }
                        if (args.item.id === 'ChangePasswordCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                state.userId = mainGrid.obj.getSelectedRecords()[0].id ?? '';
                                changePasswordModal.obj.show();
                            }
                        }
                        if (args.item.id === 'ChangeAvatarCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                state.userId = mainGrid.obj.getSelectedRecords()[0].id ?? '';
                                changeAvatarModal.obj.show();
                            }
                        }
                    }
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },
            refresh: () => mainGrid.obj.setProperties({ dataSource: state.mainData })
        };

        const handler = {
            handleSubmit: async () => {
                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 200));

                state.errors.firstName = '';
                state.errors.lastName = '';
                let isValid = true;

                if (!state.firstName) {
                    state.errors.firstName = 'الاسم الأول مطلوب.';
                    isValid = false;
                }
                if (!state.lastName) {
                    state.errors.lastName = 'اسم العائلة مطلوب.';
                    isValid = false;
                }
                if (!isValid) {
                    state.isSubmitting = false;
                    return;
                }

                try {
                    const response = await services.updateMainData(state.userId, state.firstName, state.lastName, state.companyName);
                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();
                        Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'سيتم الإغلاق...', timer: 2000, showConfirmButton: false });
                        setTimeout(() => mainModal.obj.hide(), 2000);
                    } else {
                        Swal.fire({ icon: 'error', title: 'فشل الحفظ', text: response.data.message ?? 'يرجى التحقق من البيانات.', confirmButtonText: 'حاول مرة أخرى' });
                    }
                } catch (error) {
                    Swal.fire({ icon: 'error', title: 'حدث خطأ', text: error.response?.data?.message ?? 'يرجى المحاولة مرة أخرى.', confirmButtonText: 'موافق' });
                } finally {
                    state.isSubmitting = false;
                }
            },
            handleChangePassword: async () => {
                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 200));

                state.errors.oldPassword = '';
                state.errors.newPassword = '';
                state.errors.confirmNewPassword = '';
                let isValid = true;

                if (!state.oldPassword) {
                    state.errors.oldPassword = 'كلمة المرور القديمة مطلوبة.';
                    isValid = false;
                } else if (state.oldPassword.length < 6) {
                    state.errors.oldPassword = 'يجب أن تكون كلمة المرور القديمة 6 أحرف على الأقل.';
                    isValid = false;
                }

                if (!state.newPassword) {
                    state.errors.newPassword = 'كلمة المرور الجديدة مطلوبة.';
                    isValid = false;
                } else if (state.newPassword.length < 6) {
                    state.errors.newPassword = 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.';
                    isValid = false;
                }

                if (!state.confirmNewPassword) {
                    state.errors.confirmNewPassword = 'تأكيد كلمة المرور مطلوب.';
                    isValid = false;
                } else if (state.confirmNewPassword.length < 6) {
                    state.errors.confirmNewPassword = 'يجب أن يكون تأكيد كلمة المرور 6 أحرف على الأقل.';
                    isValid = false;
                }

                if (!isValid) {
                    state.isSubmitting = false;
                    return;
                }

                try {
                    const response = await services.updatePasswordData(state.userId, state.oldPassword, state.newPassword, state.confirmNewPassword);
                    if (response.data.code === 200) {
                        Swal.fire({ icon: 'success', title: 'تم الحفظ', text: 'سيتم الإغلاق...', timer: 2000, showConfirmButton: false });
                        setTimeout(() => changePasswordModal.obj.hide(), 2000);
                    } else {
                        Swal.fire({ icon: 'error', title: 'فشل الحفظ', text: response.data.message ?? 'يرجى التحقق من البيانات.', confirmButtonText: 'حاول مرة أخرى' });
                    }
                } catch (error) {
                    Swal.fire({ icon: 'error', title: 'حدث خطأ', text: error.response?.data?.message ?? 'يرجى المحاولة مرة أخرى.', confirmButtonText: 'موافق' });
                } finally {
                    state.isSubmitting = false;
                }
            },
            handleFileUpload: async (file) => {
                try {
                    const response = await services.uploadImage(file);
                    if (response.status === 200) {
                        const imageName = response?.data?.content?.imageName;
                        await services.updateAvatarData(state.userId, imageName);
                        StorageManager.saveAvatar(imageName);

                        Swal.fire({ icon: "success", title: "تم الرفع بنجاح", text: "سيتم تحديث الصفحة...", timer: 1000, showConfirmButton: false });
                        setTimeout(() => { changeAvatarModal.obj.hide(); location.reload(); }, 1000);
                    } else {
                        Swal.fire({ icon: "error", title: "فشل الرفع", text: response.message ?? "حدث خطأ أثناء الرفع." });
                    }
                } catch (error) {
                    Swal.fire({ icon: "error", title: "فشل الرفع", text: "حدث خطأ غير متوقع." });
                }
            },
        };

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data;
            },
        };

        Vue.onMounted(async () => {
            Dropzone.autoDiscover = false;
            try {
                await SecurityManager.authorizePage(['Profiles']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                mainModal.create();
                changePasswordModal.create();
                changeAvatarModal.create();

                initDropzone();
            } catch (e) {
                console.error('خطأ تهيئة الصفحة:', e);
            }
        });

        let dropzoneInitialized = false;
        const initDropzone = () => {
            if (!dropzoneInitialized && imageUploadRef.value) {
                dropzoneInitialized = true;
                const dropzoneInstance = new Dropzone(imageUploadRef.value, {
                    url: "api/FileImage/UploadImage",
                    paramName: "file",
                    maxFilesize: 5,
                    acceptedFiles: "image/*",
                    addRemoveLinks: true,
                    dictDefaultMessage: "اسحب الصورة هنا لإجراء الرفع",
                    autoProcessQueue: false,
                    init: function () {
                        this.on("addedfile", async function (file) {
                            await handler.handleFileUpload(file);
                        });
                    }
                });
            }
        };

        const mainModal = { obj: null, create: () => { mainModal.obj = new bootstrap.Modal(mainModalRef.value, { backdrop: 'static', keyboard: false }); } };
        const changePasswordModal = { obj: null, create: () => { changePasswordModal.obj = new bootstrap.Modal(changePasswordModalRef.value, { backdrop: 'static', keyboard: false }); } };
        const changeAvatarModal = { obj: null, create: () => { changeAvatarModal.obj = new bootstrap.Modal(changeAvatarModalRef.value, { backdrop: 'static', keyboard: false }); } };

        return {
            state,
            mainGridRef,
            mainModalRef,
            changePasswordModalRef,
            changeAvatarModalRef,
            firstNameRef,
            lastNameRef,
            companyNameRef,
            oldPasswordRef,
            newPasswordRef,
            confirmNewPasswordRef,
            imageUploadRef,
            handler
        };
    }
};

Vue.createApp(App).mount('#app');
