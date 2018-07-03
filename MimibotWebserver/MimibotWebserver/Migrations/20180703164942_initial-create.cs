using Microsoft.EntityFrameworkCore.Migrations;

namespace MimibotWebserver.Migrations
{
    public partial class initialcreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    GameId = table.Column<string>(nullable: false),
                    Questions = table.Column<string>(nullable: true),
                    Answers = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.GameId);
                });

            migrationBuilder.CreateTable(
                name: "Mark",
                columns: table => new
                {
                    MarkId = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    Question = table.Column<string>(nullable: true),
                    MarkValue = table.Column<string>(nullable: true),
                    Date = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mark", x => x.MarkId);
                });

            migrationBuilder.CreateTable(
                name: "Speechs",
                columns: table => new
                {
                    SpeechId = table.Column<string>(nullable: false),
                    SpeechDetails = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true),
                    Tags = table.Column<string>(nullable: true),
                    Sentiment = table.Column<string>(nullable: true),
                    Keyword = table.Column<string>(nullable: true),
                    DateTime = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Speechs", x => x.SpeechId);
                });

            migrationBuilder.CreateTable(
                name: "Uploads",
                columns: table => new
                {
                    UploadId = table.Column<string>(nullable: false),
                    Password = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true),
                    SongLink = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uploads", x => x.UploadId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    Password = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Mark");

            migrationBuilder.DropTable(
                name: "Speechs");

            migrationBuilder.DropTable(
                name: "Uploads");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
