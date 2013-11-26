namespace JDT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserProfiles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserName = c.String(nullable: false),
                        FirstName = c.String(nullable: false),
                        LastName = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        PictureUrl = c.String(),
                        ContentAuthorId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.UserProfiles", t => t.ContentAuthorId)
                .Index(t => t.ContentAuthorId);
            
            CreateTable(
                "dbo.Plans",
                c => new
                    {
                        PlanId = c.Int(nullable: false, identity: true),
                        AuthorId = c.Int(nullable: false),
                        Hide = c.Boolean(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PlanId)
                .ForeignKey("dbo.UserProfiles", t => t.AuthorId, cascadeDelete: true)
                .Index(t => t.AuthorId);
            
            CreateTable(
                "dbo.WorkOuts",
                c => new
                    {
                        WorkOutId = c.Int(nullable: false, identity: true),
                        Hide = c.Boolean(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.WorkOutId);
            
            CreateTable(
                "dbo.JdtTasks",
                c => new
                    {
                        TaskId = c.Int(nullable: false, identity: true),
                        MinSets = c.Int(),
                        MaxSets = c.Int(),
                        MinReps = c.Int(),
                        MaxReps = c.Int(),
                        Duration = c.Int(),
                        Hide = c.Boolean(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TaskId);
            
            CreateTable(
                "dbo.Diets",
                c => new
                    {
                        DietId = c.Int(nullable: false, identity: true),
                        Hide = c.Boolean(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.DietId);
            
            CreateTable(
                "dbo.Meals",
                c => new
                    {
                        MealId = c.Int(nullable: false, identity: true),
                        Hide = c.Boolean(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.MealId);
            
            CreateTable(
                "dbo.Ingredients",
                c => new
                    {
                        IngredientId = c.Int(nullable: false, identity: true),
                        Hide = c.Boolean(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.IngredientId);
            
            CreateTable(
                "dbo.PreConsumers",
                c => new
                    {
                        PreConsumerId = c.Int(nullable: false, identity: true),
                        FirstName = c.String(nullable: false),
                        LastName = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        ContentAuthorId = c.Int(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Hide = c.Boolean(),
                        Plan_PlanId = c.Int(),
                    })
                .PrimaryKey(t => t.PreConsumerId)
                .ForeignKey("dbo.Plans", t => t.Plan_PlanId)
                .ForeignKey("dbo.UserProfiles", t => t.ContentAuthorId, cascadeDelete: true)
                .Index(t => t.Plan_PlanId)
                .Index(t => t.ContentAuthorId);
            
            CreateTable(
                "dbo.Assignments",
                c => new
                    {
                        AssignmentId = c.Int(nullable: false, identity: true),
                        DueDate = c.DateTime(),
                        WeekNumber = c.Int(),
                        DayNumber = c.Int(),
                        ConsumerId = c.Int(nullable: false),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Task_TaskId = c.Int(),
                        Diet_DietId = c.Int(),
                    })
                .PrimaryKey(t => t.AssignmentId)
                .ForeignKey("dbo.JdtTasks", t => t.Task_TaskId)
                .ForeignKey("dbo.Diets", t => t.Diet_DietId)
                .ForeignKey("dbo.UserProfiles", t => t.ConsumerId, cascadeDelete: true)
                .Index(t => t.Task_TaskId)
                .Index(t => t.Diet_DietId)
                .Index(t => t.ConsumerId);
            
            CreateTable(
                "dbo.WorkOut_Task",
                c => new
                    {
                        WorkOutId = c.Int(nullable: false),
                        TaskId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.WorkOutId, t.TaskId })
                .ForeignKey("dbo.WorkOuts", t => t.WorkOutId, cascadeDelete: true)
                .ForeignKey("dbo.JdtTasks", t => t.TaskId, cascadeDelete: true)
                .Index(t => t.WorkOutId)
                .Index(t => t.TaskId);
            
            CreateTable(
                "dbo.Plan_WorkOut",
                c => new
                    {
                        PlanId = c.Int(nullable: false),
                        WorkOutId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.PlanId, t.WorkOutId })
                .ForeignKey("dbo.Plans", t => t.PlanId, cascadeDelete: true)
                .ForeignKey("dbo.WorkOuts", t => t.WorkOutId, cascadeDelete: true)
                .Index(t => t.PlanId)
                .Index(t => t.WorkOutId);
            
            CreateTable(
                "dbo.Meal_Ingredient",
                c => new
                    {
                        MealId = c.Int(nullable: false),
                        IngredientId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.MealId, t.IngredientId })
                .ForeignKey("dbo.Meals", t => t.MealId, cascadeDelete: true)
                .ForeignKey("dbo.Ingredients", t => t.IngredientId, cascadeDelete: true)
                .Index(t => t.MealId)
                .Index(t => t.IngredientId);
            
            CreateTable(
                "dbo.Diet_Meal",
                c => new
                    {
                        DietId = c.Int(nullable: false),
                        MealId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.DietId, t.MealId })
                .ForeignKey("dbo.Diets", t => t.DietId, cascadeDelete: true)
                .ForeignKey("dbo.Meals", t => t.MealId, cascadeDelete: true)
                .Index(t => t.DietId)
                .Index(t => t.MealId);
            
            CreateTable(
                "dbo.Plan_Diet",
                c => new
                    {
                        PlanId = c.Int(nullable: false),
                        DietId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.PlanId, t.DietId })
                .ForeignKey("dbo.Plans", t => t.PlanId, cascadeDelete: true)
                .ForeignKey("dbo.Diets", t => t.DietId, cascadeDelete: true)
                .Index(t => t.PlanId)
                .Index(t => t.DietId);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.Plan_Diet", new[] { "DietId" });
            DropIndex("dbo.Plan_Diet", new[] { "PlanId" });
            DropIndex("dbo.Diet_Meal", new[] { "MealId" });
            DropIndex("dbo.Diet_Meal", new[] { "DietId" });
            DropIndex("dbo.Meal_Ingredient", new[] { "IngredientId" });
            DropIndex("dbo.Meal_Ingredient", new[] { "MealId" });
            DropIndex("dbo.Plan_WorkOut", new[] { "WorkOutId" });
            DropIndex("dbo.Plan_WorkOut", new[] { "PlanId" });
            DropIndex("dbo.WorkOut_Task", new[] { "TaskId" });
            DropIndex("dbo.WorkOut_Task", new[] { "WorkOutId" });
            DropIndex("dbo.Assignments", new[] { "ConsumerId" });
            DropIndex("dbo.Assignments", new[] { "Diet_DietId" });
            DropIndex("dbo.Assignments", new[] { "Task_TaskId" });
            DropIndex("dbo.PreConsumers", new[] { "ContentAuthorId" });
            DropIndex("dbo.PreConsumers", new[] { "Plan_PlanId" });
            DropIndex("dbo.Plans", new[] { "AuthorId" });
            DropIndex("dbo.UserProfiles", new[] { "ContentAuthorId" });
            DropForeignKey("dbo.Plan_Diet", "DietId", "dbo.Diets");
            DropForeignKey("dbo.Plan_Diet", "PlanId", "dbo.Plans");
            DropForeignKey("dbo.Diet_Meal", "MealId", "dbo.Meals");
            DropForeignKey("dbo.Diet_Meal", "DietId", "dbo.Diets");
            DropForeignKey("dbo.Meal_Ingredient", "IngredientId", "dbo.Ingredients");
            DropForeignKey("dbo.Meal_Ingredient", "MealId", "dbo.Meals");
            DropForeignKey("dbo.Plan_WorkOut", "WorkOutId", "dbo.WorkOuts");
            DropForeignKey("dbo.Plan_WorkOut", "PlanId", "dbo.Plans");
            DropForeignKey("dbo.WorkOut_Task", "TaskId", "dbo.JdtTasks");
            DropForeignKey("dbo.WorkOut_Task", "WorkOutId", "dbo.WorkOuts");
            DropForeignKey("dbo.Assignments", "ConsumerId", "dbo.UserProfiles");
            DropForeignKey("dbo.Assignments", "Diet_DietId", "dbo.Diets");
            DropForeignKey("dbo.Assignments", "Task_TaskId", "dbo.JdtTasks");
            DropForeignKey("dbo.PreConsumers", "ContentAuthorId", "dbo.UserProfiles");
            DropForeignKey("dbo.PreConsumers", "Plan_PlanId", "dbo.Plans");
            DropForeignKey("dbo.Plans", "AuthorId", "dbo.UserProfiles");
            DropForeignKey("dbo.UserProfiles", "ContentAuthorId", "dbo.UserProfiles");
            DropTable("dbo.Plan_Diet");
            DropTable("dbo.Diet_Meal");
            DropTable("dbo.Meal_Ingredient");
            DropTable("dbo.Plan_WorkOut");
            DropTable("dbo.WorkOut_Task");
            DropTable("dbo.Assignments");
            DropTable("dbo.PreConsumers");
            DropTable("dbo.Ingredients");
            DropTable("dbo.Meals");
            DropTable("dbo.Diets");
            DropTable("dbo.JdtTasks");
            DropTable("dbo.WorkOuts");
            DropTable("dbo.Plans");
            DropTable("dbo.UserProfiles");
        }
    }
}
