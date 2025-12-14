using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.ScrappingManager.Queries
{
    using MediatR;
    using System;
    using System.Collections.Generic;

    namespace Application.Features.ScrappingManager.Queries
    {
        public class GetScrappingReport : IRequest<List<ScrappingReportDto>>
        {
            public DateTime? FromDate { get; set; }
            public DateTime? ToDate { get; set; }
            public Guid? WarehouseId { get; set; }
        }
    }

}
