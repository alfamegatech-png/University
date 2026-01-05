using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addreitemInventoryTrans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PurchaseOrderItemId",
                table: "InventoryTransaction",
                type: "nvarchar(50)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransaction_PurchaseOrderItemId",
                table: "InventoryTransaction",
                column: "PurchaseOrderItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryTransaction_PurchaseOrderItem_PurchaseOrderItemId",
                table: "InventoryTransaction",
                column: "PurchaseOrderItemId",
                principalTable: "PurchaseOrderItem",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryTransaction_PurchaseOrderItem_PurchaseOrderItemId",
                table: "InventoryTransaction");

            migrationBuilder.DropIndex(
                name: "IX_InventoryTransaction_PurchaseOrderItemId",
                table: "InventoryTransaction");

            migrationBuilder.DropColumn(
                name: "PurchaseOrderItemId",
                table: "InventoryTransaction");
        }
    }
}
