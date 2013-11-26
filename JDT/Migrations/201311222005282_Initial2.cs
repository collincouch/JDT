namespace JDT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.PreConsumers", "Hide", c => c.Boolean());
            DropColumn("dbo.PreConsumers", "Name");
            DropColumn("dbo.PreConsumers", "Description");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PreConsumers", "Description", c => c.String());
            AddColumn("dbo.PreConsumers", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.PreConsumers", "Hide", c => c.Boolean(nullable: false));
        }
    }
}
