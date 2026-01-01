using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddquantitiesToIssueRequestsItemTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Quantity",
                table: "IssueRequestsItem",
                newName: "SuppliedQuantity");

            migrationBuilder.AddColumn<double>(
                name: "AvailableQuantity",
                table: "IssueRequestsItem",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableQuantity",
                table: "IssueRequestsItem");

            migrationBuilder.RenameColumn(
                name: "SuppliedQuantity",
                table: "IssueRequestsItem",
                newName: "Quantity");
        }
    }
}
