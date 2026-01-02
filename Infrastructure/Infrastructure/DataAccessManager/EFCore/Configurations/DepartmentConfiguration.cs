using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations
{
    public class DepartmentConfiguration : BaseEntityConfiguration<Department>
    {
        public override void Configure(EntityTypeBuilder<Department> builder)
        {
            base.Configure(builder);

            builder.Property(x => x.Name)
                   .HasMaxLength(NameConsts.MaxLength)
                   .IsRequired();

            builder.Property(x => x.Description)
                   .HasMaxLength(DescriptionConsts.MaxLength)
                   .IsRequired(false);

            builder.HasIndex(x => x.Name).IsUnique();
        }
    
    }
}
