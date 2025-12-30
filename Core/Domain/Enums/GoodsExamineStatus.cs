using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum  GoodsExamineStatus
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
}
