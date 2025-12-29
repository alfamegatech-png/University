using Domain.Common;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class GoodsExamine:BaseEntity
    {
        public string? Number { get; set; }
        public DateTime? ExamineDate { get; set; }
        public GoodsExamineStatus? Status { get; set; }
        public string? Description { get; set; }
        public DateTime? CommiteeDate { get; set; }
        public string? CommitteeDesionNumber { get; set; }
        public string? PurchaseOrderId { get; set; }
        public PurchaseOrder? PurchaseOrder { get; set; }
    }
}
