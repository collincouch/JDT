namespace JDT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PreConsumers", "Name", c => c.String(nullable: false));
            AddColumn("dbo.PreConsumers", "Description", c => c.String());
            AddColumn("dbo.Assignments", "Hide", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Assignments", "Hide");
            DropColumn("dbo.PreConsumers", "Description");
            DropColumn("dbo.PreConsumers", "Name");
        }
    }
}
