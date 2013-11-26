namespace JDT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial4 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Plans", "CreatorId", "dbo.UserProfiles");
            DropIndex("dbo.Plans", new[] { "CreatorId" });
            AddForeignKey("dbo.Plans", "CreatorId", "dbo.UserProfiles", "Id");
            CreateIndex("dbo.Plans", "CreatorId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Plans", new[] { "CreatorId" });
            DropForeignKey("dbo.Plans", "CreatorId", "dbo.UserProfiles");
            CreateIndex("dbo.Plans", "CreatorId");
            AddForeignKey("dbo.Plans", "CreatorId", "dbo.UserProfiles", "Id", cascadeDelete: true);
        }
    }
}
