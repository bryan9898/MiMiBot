﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MimibotWebserver.Models;

namespace MimibotWebserver.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20180701163256_initial-create")]
    partial class initialcreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.0-rtm-30799")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MimibotWebserver.Models.Game", b =>
                {
                    b.Property<string>("GameId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Answers");

                    b.Property<string>("Questions");

                    b.HasKey("GameId");

                    b.ToTable("Games");
                });

            modelBuilder.Entity("MimibotWebserver.Models.Speech", b =>
                {
                    b.Property<string>("SpeechId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DateTime");

                    b.Property<string>("Keyword");

                    b.Property<string>("Sentiment");

                    b.Property<string>("SpeechDetails");

                    b.Property<string>("Tags");

                    b.Property<string>("UserId");

                    b.HasKey("SpeechId");

                    b.ToTable("Speechs");
                });

            modelBuilder.Entity("MimibotWebserver.Models.Upload", b =>
                {
                    b.Property<string>("UploadId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Password");

                    b.Property<string>("SongLink");

                    b.Property<string>("UserId");

                    b.HasKey("UploadId");

                    b.ToTable("Uploads");
                });

            modelBuilder.Entity("MimibotWebserver.Models.User", b =>
                {
                    b.Property<string>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<string>("Password");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}