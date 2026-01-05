using Domain.Common;

namespace Domain.Entities;

public class IssueRequestsItem : BaseEntity
{
    public string? IssueRequestsId { get; set; }
    public IssueRequests? IssueRequests { get; set; }
    public string? ProductId { get; set; }
    public Product? Product { get; set; }
    public string? Summary { get; set; }
    public double? UnitPrice { get; set; } = 0;
    public double? AvailableQuantity { get; set; } 
    public double? RequestedQuantity { get; set; } 
    public double? SuppliedQuantity { get; set; } 
    public double? Total { get; set; } = 0;
    public string? WarehouseId { get; set; }


}
