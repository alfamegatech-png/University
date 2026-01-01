using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ApplyGoodsExamineConfigs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop FK to GoodsExamine
            migrationBuilder.DropForeignKey(
                name: "FK_ExamineCommitee_GoodsExamine_GoodsExamineId",
                table: "ExamineCommitee");

            // Drop self-referencing FK
            migrationBuilder.DropForeignKey(
                name: "FK_ExamineCommitee_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee");

            // ----- DROP PRIMARY KEYS -----
            migrationBuilder.DropPrimaryKey(
                name: "PK_GoodsExamine",
                table: "GoodsExamine");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamineCommitee",
                table: "ExamineCommitee");

            // ----- ALTER COLUMNS -----
            // GoodsExamine
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "GoodsExamine",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "UpdatedById",
                table: "GoodsExamine",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "GoodsExamine",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "GoodsExamine",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "GoodsExamine",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "GoodsExamine",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CommitteeDesionNumber",
                table: "GoodsExamine",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

  

            migrationBuilder.AlterColumn<string>(
                name: "UpdatedById",
                table: "ExamineCommitee",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "ExamineCommitee",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "ExamineCommitee",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "GoodsExamineId",
                table: "ExamineCommitee",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ExamineCommiteeId",
                table: "ExamineCommitee",
                type: "nvarchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmployeePositionName",
                table: "ExamineCommitee",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeName",
                table: "ExamineCommitee",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ExamineCommitee",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "ExamineCommitee",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

     


          

            migrationBuilder.CreateIndex(
                name: "IX_GoodsExamine_Number",
                table: "GoodsExamine",
                column: "Number");

            migrationBuilder.CreateIndex(
                name: "IX_ExamineCommitee_Number",
                table: "ExamineCommitee",
                column: "Number");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ----- DROP INDEXES -----
            migrationBuilder.DropIndex(
                name: "IX_GoodsExamine_Number",
                table: "GoodsExamine");

            migrationBuilder.DropIndex(
                name: "IX_ExamineCommitee_Number",
                table: "ExamineCommitee");

            // ----- DROP FOREIGN KEYS -----
            migrationBuilder.DropForeignKey(
                name: "FK_ExamineCommitee_GoodsExamine_GoodsExamineId",
                table: "ExamineCommitee");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamineCommitee_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee");

            // ----- DROP PRIMARY KEYS -----
            migrationBuilder.DropPrimaryKey(
                name: "PK_GoodsExamine",
                table: "GoodsExamine");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamineCommitee",
                table: "ExamineCommitee");

            // ----- REVERT COLUMN CHANGES -----
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "GoodsExamine",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ExamineCommitee",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);


            migrationBuilder.AlterColumn<string>(
                name: "UpdatedById",
                table: "GoodsExamine",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "GoodsExamine",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "GoodsExamine",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "GoodsExamine",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "GoodsExamine",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CommitteeDesionNumber",
                table: "GoodsExamine",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000,
                oldNullable: true);

    

            migrationBuilder.AlterColumn<string>(
                name: "UpdatedById",
                table: "ExamineCommitee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "ExamineCommitee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "ExamineCommitee",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "GoodsExamineId",
                table: "ExamineCommitee",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ExamineCommiteeId",
                table: "ExamineCommitee",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmployeePositionName",
                table: "ExamineCommitee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeName",
                table: "ExamineCommitee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ExamineCommitee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "ExamineCommitee",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450,
                oldNullable: true);

        

            // ----- RECREATE FOREIGN KEYS -----
            migrationBuilder.AddForeignKey(
                name: "FK_ExamineCommitee_GoodsExamine_GoodsExamineId",
                table: "ExamineCommitee",
                column: "GoodsExamineId",
                principalTable: "GoodsExamine",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamineCommitee_ExamineCommitee_ExamineCommiteeId",
                table: "ExamineCommitee",
                column: "ExamineCommiteeId",
                principalTable: "ExamineCommitee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
