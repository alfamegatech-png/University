using Application.Common.Services.SecurityManager;
using System.Text.Json;

namespace Infrastructure.SecurityManager.NavigationMenu
{
    public class JsonStructureItem
    {
        public string? URL { get; set; }
        public string? Name { get; set; }
        public bool IsModule { get; set; }
        public List<JsonStructureItem> Children { get; set; } = new List<JsonStructureItem>();
    }

    public static class NavigationTreeStructure
    {
        public static readonly string JsonStructure = """
        [
            {
                "URL": "#",
                "Name": "لوحات التحكم",
                "IsModule": true,
                "Children": [
                    {
                        "URL": "/Dashboards/DefaultDashboard",
                        "Name": "الافتراضية",
                        "IsModule": false
                    }
                ]
            },
            {
                "URL": "#",
                "Name": "المبيعات",
                "IsModule": true,
                "Children": [
                    
                    {
                        "URL": "/SalesOrders/SalesOrderList",
                        "Name": "أوامر البيع",
                        "IsModule": false
                    },
                    {
                        "URL": "/SalesReports/SalesReportList",
                        "Name": "تقارير المبيعات",
                        "IsModule": false
                    }
                ]
            },
            {
                "URL": "#",
                "Name": "المشتريات",
                "IsModule": true,
                "Children": [
                    {
                        "URL": "/VendorGroups/VendorGroupList",
                        "Name": "مجموعات الموردين",
                        "IsModule": false
                    },
                    {
                        "URL": "/VendorCategories/VendorCategoryList",
                        "Name": "تصنيفات الموردين",
                        "IsModule": false
                    },
                    {
                        "URL": "/Vendors/VendorList",
                        "Name": "الموردين",
                        "IsModule": false
                    },
                    {
                        "URL": "/VendorContacts/VendorContactList",
                        "Name": "جهات اتصال الموردين",
                        "IsModule": false
                    }
                    
                ]
            },

        {
                "URL": "#",
                "Name": "الجديد",
                "IsModule": true,
                "Children": [  
         {
                        "URL": "/PurchaseOrders/PurchaseOrderList",
                        "Name": "أوامر التوريد",
                        "IsModule": false
                    },

                    {
                        "URL": "/PurchaseReports/PurchaseReportList",
                        "Name": "تقارير أوامر التوريد",
                        "IsModule": false
                    },
                        {
                        "URL": "/SalesOrders/SalesOrderList",
                        "Name": "أوامر البيع",
                        "IsModule": false
                    },
                    {
                        "URL": "/SalesReports/SalesReportList",
                        "Name": "تقارير المبيعات",
                        "IsModule": false
                    },
                    {
                        "URL": "/GoodsReceives/GoodsReceiveList",
                        "Name": "استلام ",
                        "IsModule": false
                    },
         
                    {
                        "URL": "/PurchaseReturns/PurchaseReturnList",
                        "Name": "مرتجعات المشتريات",
                        "IsModule": false
                    },
                    {
                        "URL": "/TransferOuts/TransferOutList",
                        "Name": "تحويل صادر",
                        "IsModule": false
                    },
                    {
                        "URL": "/TransferIns/TransferInList",
                        "Name": "تحويل وارد",
                        "IsModule": false
                    },
                    {
                        "URL": "/PositiveAdjustments/PositiveAdjustmentList",
                        "Name": "تسويات موجبة",
                        "IsModule": false
                    },
                    {
                        "URL": "/NegativeAdjustments/NegativeAdjustmentList",
                        "Name": "تسويات سالبة",
                        "IsModule": false
                    },
                    {
                        "URL": "/Scrappings/ScrappingList",
                        "Name": "الإتلاف",
                        "IsModule": false
                    },
                    {
                        "URL": "/StockCounts/StockCountList",
                        "Name": "جرد المخزون",
                        "IsModule": false
                    }
                ]
            },
        
            {
                "URL": "#",
                "Name": "المخزون",
                "IsModule": true,
                "Children": [
                    {
                        "URL": "/UnitMeasures/UnitMeasureList",
                        "Name": "وحدات القياس",
                        "IsModule": false
                    },
                    {
                        "URL": "/ProductGroups/ProductGroupList",
                        "Name": "مجموعات المنتجات",
                        "IsModule": false
                    },
                    {
                        "URL": "/Products/ProductList",
                        "Name": "المنتجات",
                        "IsModule": false
                    },
                    {
                        "URL": "/Warehouses/WarehouseList",
                        "Name": "المخازن",
                        "IsModule": false
                    },
                    {
                        "URL": "/DeliveryOrders/DeliveryOrderList",
                        "Name": "أوامر التسليم",
                        "IsModule": false
                    },
                    {
                        "URL": "/SalesReturns/SalesReturnList",
                        "Name": "مرتجعات المبيعات",
                        "IsModule": false
                    },
                    {
                        "URL": "/GoodsReceives/GoodsReceiveList",
                        "Name": "استلام البضائع",
                        "IsModule": false
                    },
                    {
                        "URL": "/PurchaseReturns/PurchaseReturnList",
                        "Name": "مرتجعات المشتريات",
                        "IsModule": false
                    },
                    {
                        "URL": "/TransferOuts/TransferOutList",
                        "Name": "تحويل صادر",
                        "IsModule": false
                    },
                    {
                        "URL": "/TransferIns/TransferInList",
                        "Name": "تحويل وارد",
                        "IsModule": false
                    },
                    {
                        "URL": "/PositiveAdjustments/PositiveAdjustmentList",
                        "Name": "تسويات موجبة",
                        "IsModule": false
                    },
                    {
                        "URL": "/NegativeAdjustments/NegativeAdjustmentList",
                        "Name": "تسويات سالبة",
                        "IsModule": false
                    },
                    {
                        "URL": "/Scrappings/ScrappingList",
                        "Name": "الإتلاف",
                        "IsModule": false
                    },
                    {
                        "URL": "/StockCounts/StockCountList",
                        "Name": "جرد المخزون",
                        "IsModule": false
                    },
                    {
                        "URL": "/TransactionReports/TransactionReportList",
                        "Name": "تقارير العمليات",
                        "IsModule": false
                    },
                    {
                        "URL": "/StockReports/StockReportList",
                        "Name": "تقارير المخزون",
                        "IsModule": false
                    },
                    {
                        "URL": "/MovementReports/MovementReportList",
                        "Name": "تقارير الحركة",
                        "IsModule": false
                    }
                ]
            },
            {
                "URL": "#",
                "Name": "الأدوات",
                "IsModule": true,
                "Children": [   
                    {
                        "URL": "/Todos/TodoList",
                        "Name": "المهام",
                        "IsModule": false
                    },
                    {
                        "URL": "/TodoItems/TodoItemList",
                        "Name": "عناصر المهام",
                        "IsModule": false
                    }
                ]
            },
            {
                "URL": "#",
                "Name": "الأعضاء",
                "IsModule": true,
                "Children": [
                    {
                        "URL": "/Users/UserList",
                        "Name": "المستخدمون",
                        "IsModule": false
                    },
                    {
                        "URL": "/Roles/RoleList",
                        "Name": "الأدوار",
                        "IsModule": false
                    }
                ]
            },
            {
                "URL": "#",
                "Name": "الملفات الشخصية",
                "IsModule": true,
                "Children": [
                    {
                        "URL": "/Profiles/MyProfile",
                        "Name": "ملفي الشخصي",
                        "IsModule": false
                    }
                ]
            },
            {
                "URL": "#",
                "Name": "الإعدادات",
                "IsModule": true,
                "Children": [
                    {
                        "URL": "/Companies/MyCompany",
                        "Name": "شركتي",
                        "IsModule": false
                    },
                    {
                        "URL": "/Taxs/TaxList",
                        "Name": "الضرائب",
                        "IsModule": false
                    },
                    {
                        "URL": "/NumberSequences/NumberSequenceList",
                        "Name": "تسلسل الأرقام",
                        "IsModule": false
                    }
                ]
            }
        ]
        """;

        public static List<MenuNavigationTreeNodeDto> GetCompleteMenuNavigationTreeNode()
        {
            var json = JsonStructure;
            var menus = JsonSerializer.Deserialize<List<JsonStructureItem>>(json);

            List<MenuNavigationTreeNodeDto> nodes = new List<MenuNavigationTreeNodeDto>();
            var index = 1;

            void AddNodes(List<JsonStructureItem> menuItems, string? parentId = null)
            {
                foreach (var item in menuItems)
                {
                    var nodeId = index.ToString();
                    if (item.IsModule)
                    {
                        nodes.Add(new MenuNavigationTreeNodeDto(nodeId, item.Name ?? "", param_hasChild: true, param_expanded: false));
                    }
                    else
                    {
                        nodes.Add(new MenuNavigationTreeNodeDto(nodeId, item.Name ?? "", parentId, item.URL));
                    }

                    index++;

                    if (item.Children != null && item.Children.Count > 0)
                    {
                        AddNodes(item.Children, nodeId);
                    }
                }
            }

            if (menus != null) AddNodes(menus);

            return nodes;
        }

        public static string GetFirstSegmentFromUrlPath(string? path)
        {
            var result = string.Empty;
            if (path != null && path.Contains("/"))
            {
                string[] parts = path.Split("/");
                if (parts.Length > 2)
                {
                    result = parts[1];
                }
            }
            return result;
        }

        public static List<string> GetCompleteFirstMenuNavigationSegment()
        {
            var json = JsonStructure;
            var menus = JsonSerializer.Deserialize<List<JsonStructureItem>>(json);
            var result = new List<string>();

            if (menus != null)
            {
                foreach (var item in menus)
                {
                    ProcessMenuItem(item, result);
                }
            }

            return result;
        }

        private static void ProcessMenuItem(JsonStructureItem item, List<string> result)
        {
            if (!string.IsNullOrEmpty(item.URL) && item.URL != "#")
            {
                var segment = GetFirstSegmentFromUrlPath(item.URL);
                if (!string.IsNullOrEmpty(segment) && !result.Contains(segment))
                {
                    result.Add(segment);
                }
            }

            if (item.Children != null)
            {
                foreach (var child in item.Children)
                {
                    ProcessMenuItem(child, result);
                }
            }
        }
    }
}
