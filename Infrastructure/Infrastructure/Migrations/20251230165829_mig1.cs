using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mig1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExamineCommiteeId",
                table: "ExamineCommitee",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee",
                column: "ExamineCommiteeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamineCommitee_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee",
                column: "ExamineCommiteeId",
                principalTable: "ExamineCommitee",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamineCommitee_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee");

            migrationBuilder.DropIndex(
                name: "IX_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee");

            migrationBuilder.DropColumn(
                name: "ExamineCommiteeId",
                table: "ExamineCommitee");
        }
    }
}
