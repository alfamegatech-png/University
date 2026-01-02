using System.ComponentModel;

namespace Domain.Enums;

public enum GoodsReceiveStatus
{
    [Description("مؤجل")]
    Draft = 0,
    [Description("ملغي")]
    Cancelled = 1,
    [Description("مؤكد")]
    Confirmed = 2,
    [Description("مؤرشف")]
    Archived = 3
}
