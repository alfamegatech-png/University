using System.ComponentModel;

namespace Domain.Enums;

public enum SalesOrderStatus
{
    [Description("مسودة")]
    Draft = 0,
    [Description("ملغي")]
    Cancelled = 1,
    [Description("مؤكد")]
    Confirmed = 2,
    [Description("مؤرشف")]
    Archived = 3
}
