using Domain.Common;

namespace Domain.Entities;


    public class Department : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

      
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }

