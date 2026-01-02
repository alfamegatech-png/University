using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class r : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "PurchaseOrderItem",
                newName: "ItemStatus");

            migrationBuilder.AddColumn<bool>(
                name: "ItemStatus",
                table: "InventoryTransaction",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Percentage",
                table: "InventoryTransaction",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reasons",
                table: "InventoryTransaction",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemStatus",
                table: "InventoryTransaction");

            migrationBuilder.DropColumn(
                name: "Percentage",
                table: "InventoryTransaction");

            migrationBuilder.DropColumn(
                name: "Reasons",
                table: "InventoryTransaction");

            migrationBuilder.RenameColumn(
                name: "ItemStatus",
                table: "PurchaseOrderItem",
                newName: "Status");
        }
    }
}
