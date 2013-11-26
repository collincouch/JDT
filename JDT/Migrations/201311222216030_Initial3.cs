namespace JDT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.UserProfiles", "ContentAuthorId", "dbo.UserProfiles");
            DropForeignKey("dbo.Plans", "AuthorId", "dbo.UserProfiles");
            DropForeignKey("dbo.PreConsumers", "Plan_PlanId", "dbo.Plans");
            DropForeignKey("dbo.PreConsumers", "ContentAuthorId", "dbo.UserProfiles");
            DropForeignKey("dbo.Assignments", "Task_TaskId", "dbo.JdtTasks");
            DropForeignKey("dbo.WorkOut_Task", "WorkOutId", "dbo.WorkOuts");
            DropForeignKey("dbo.WorkOut_Task", "TaskId", "dbo.JdtTasks");
            DropForeignKey("dbo.Meal_Ingredient", "MealId", "dbo.Meals");
            DropForeignKey("dbo.Meal_Ingredient", "IngredientId", "dbo.Ingredients");
            DropForeignKey("dbo.Diet_Meal", "DietId", "dbo.Diets");
            DropForeignKey("dbo.Diet_Meal", "MealId", "dbo.Meals");
            DropIndex("dbo.UserProfiles", new[] { "ContentAuthorId" });
            DropIndex("dbo.Plans", new[] { "AuthorId" });
            DropIndex("dbo.PreConsumers", new[] { "Plan_PlanId" });
            DropIndex("dbo.PreConsumers", new[] { "ContentAuthorId" });
            DropIndex("dbo.Assignments", new[] { "Task_TaskId" });
            DropIndex("dbo.WorkOut_Task", new[] { "WorkOutId" });
            DropIndex("dbo.WorkOut_Task", new[] { "TaskId" });
            DropIndex("dbo.Meal_Ingredient", new[] { "MealId" });
            DropIndex("dbo.Meal_Ingredient", new[] { "IngredientId" });
            DropIndex("dbo.Diet_Meal", new[] { "DietId" });
            DropIndex("dbo.Diet_Meal", new[] { "MealId" });
            RenameColumn(table: "dbo.Assignments", name: "Task_TaskId", newName: "Task_ExerciseId");
            RenameColumn(table: "dbo.Assignments", name: "ConsumerId", newName: "UserId");
            CreateTable(
                "dbo.Exercises",
                c => new
                    {
                        ExerciseId = c.Int(nullable: false, identity: true),
                        RecMinSets = c.Int(),
                        RecMaxSets = c.Int(),
                        RecMinReps = c.Int(),
                        RecMaxReps = c.Int(),
                        RecDuration = c.Int(),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Hide = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ExerciseId);
            
            CreateTable(
                "dbo.Recipes",
                c => new
                    {
                        RecipeId = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Hide = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.RecipeId);
            
            CreateTable(
                "dbo.InvitedUsers",
                c => new
                    {
                        InvitedUserId = c.Int(nullable: false, identity: true),
                        FirstName = c.String(nullable: false),
                        LastName = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        InvitedById = c.Int(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Hide = c.Boolean(),
                        Plan_PlanId = c.Int(),
                    })
                .PrimaryKey(t => t.InvitedUserId)
                .ForeignKey("dbo.Plans", t => t.Plan_PlanId)
                .ForeignKey("dbo.UserProfiles", t => t.InvitedById, cascadeDelete: true)
                .Index(t => t.Plan_PlanId)
                .Index(t => t.InvitedById);
            
            CreateTable(
                "dbo.WorkOut_Exercise",
                c => new
                    {
                        WorkOutId = c.Int(nullable: false),
                        ExerciseId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.WorkOutId, t.ExerciseId })
                .ForeignKey("dbo.WorkOuts", t => t.WorkOutId, cascadeDelete: true)
                .ForeignKey("dbo.Exercises", t => t.ExerciseId, cascadeDelete: true)
                .Index(t => t.WorkOutId)
                .Index(t => t.ExerciseId);
            
            CreateTable(
                "dbo.Recipe_Ingredient",
                c => new
                    {
                        RecipeId = c.Int(nullable: false),
                        IngredientId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.RecipeId, t.IngredientId })
                .ForeignKey("dbo.Recipes", t => t.RecipeId, cascadeDelete: true)
                .ForeignKey("dbo.Ingredients", t => t.IngredientId, cascadeDelete: true)
                .Index(t => t.RecipeId)
                .Index(t => t.IngredientId);
            
            CreateTable(
                "dbo.Diet_Recipe",
                c => new
                    {
                        DietId = c.Int(nullable: false),
                        RecipeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.DietId, t.RecipeId })
                .ForeignKey("dbo.Diets", t => t.DietId, cascadeDelete: true)
                .ForeignKey("dbo.Recipes", t => t.RecipeId, cascadeDelete: true)
                .Index(t => t.DietId)
                .Index(t => t.RecipeId);
            
            AddColumn("dbo.UserProfiles", "InvitedById", c => c.Int());
            AddColumn("dbo.Plans", "CreatorId", c => c.Int(nullable: false));
            AddForeignKey("dbo.UserProfiles", "InvitedById", "dbo.UserProfiles", "Id");
            AddForeignKey("dbo.Plans", "CreatorId", "dbo.UserProfiles", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Assignments", "Task_ExerciseId", "dbo.Exercises", "ExerciseId");
            CreateIndex("dbo.UserProfiles", "InvitedById");
            CreateIndex("dbo.Plans", "CreatorId");
            CreateIndex("dbo.Assignments", "Task_ExerciseId");
            DropColumn("dbo.UserProfiles", "ContentAuthorId");
            DropColumn("dbo.Plans", "AuthorId");
            DropTable("dbo.JdtTasks");
            DropTable("dbo.Meals");
            DropTable("dbo.PreConsumers");
            DropTable("dbo.WorkOut_Task");
            DropTable("dbo.Meal_Ingredient");
            DropTable("dbo.Diet_Meal");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Diet_Meal",
                c => new
                    {
                        DietId = c.Int(nullable: false),
                        MealId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.DietId, t.MealId });
            
            CreateTable(
                "dbo.Meal_Ingredient",
                c => new
                    {
                        MealId = c.Int(nullable: false),
                        IngredientId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.MealId, t.IngredientId });
            
            CreateTable(
                "dbo.WorkOut_Task",
                c => new
                    {
                        WorkOutId = c.Int(nullable: false),
                        TaskId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.WorkOutId, t.TaskId });
            
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
                .PrimaryKey(t => t.PreConsumerId);
            
            CreateTable(
                "dbo.Meals",
                c => new
                    {
                        MealId = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Hide = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.MealId);
            
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
                        Name = c.String(nullable: false),
                        Description = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        DateModified = c.DateTime(nullable: false),
                        Hide = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TaskId);
            
            AddColumn("dbo.Plans", "AuthorId", c => c.Int(nullable: false));
            AddColumn("dbo.UserProfiles", "ContentAuthorId", c => c.Int());
            DropIndex("dbo.Diet_Recipe", new[] { "RecipeId" });
            DropIndex("dbo.Diet_Recipe", new[] { "DietId" });
            DropIndex("dbo.Recipe_Ingredient", new[] { "IngredientId" });
            DropIndex("dbo.Recipe_Ingredient", new[] { "RecipeId" });
            DropIndex("dbo.WorkOut_Exercise", new[] { "ExerciseId" });
            DropIndex("dbo.WorkOut_Exercise", new[] { "WorkOutId" });
            DropIndex("dbo.Assignments", new[] { "Task_ExerciseId" });
            DropIndex("dbo.InvitedUsers", new[] { "InvitedById" });
            DropIndex("dbo.InvitedUsers", new[] { "Plan_PlanId" });
            DropIndex("dbo.Plans", new[] { "CreatorId" });
            DropIndex("dbo.UserProfiles", new[] { "InvitedById" });
            DropForeignKey("dbo.Diet_Recipe", "RecipeId", "dbo.Recipes");
            DropForeignKey("dbo.Diet_Recipe", "DietId", "dbo.Diets");
            DropForeignKey("dbo.Recipe_Ingredient", "IngredientId", "dbo.Ingredients");
            DropForeignKey("dbo.Recipe_Ingredient", "RecipeId", "dbo.Recipes");
            DropForeignKey("dbo.WorkOut_Exercise", "ExerciseId", "dbo.Exercises");
            DropForeignKey("dbo.WorkOut_Exercise", "WorkOutId", "dbo.WorkOuts");
            DropForeignKey("dbo.Assignments", "Task_ExerciseId", "dbo.Exercises");
            DropForeignKey("dbo.InvitedUsers", "InvitedById", "dbo.UserProfiles");
            DropForeignKey("dbo.InvitedUsers", "Plan_PlanId", "dbo.Plans");
            DropForeignKey("dbo.Plans", "CreatorId", "dbo.UserProfiles");
            DropForeignKey("dbo.UserProfiles", "InvitedById", "dbo.UserProfiles");
            DropColumn("dbo.Plans", "CreatorId");
            DropColumn("dbo.UserProfiles", "InvitedById");
            DropTable("dbo.Diet_Recipe");
            DropTable("dbo.Recipe_Ingredient");
            DropTable("dbo.WorkOut_Exercise");
            DropTable("dbo.InvitedUsers");
            DropTable("dbo.Recipes");
            DropTable("dbo.Exercises");
            RenameColumn(table: "dbo.Assignments", name: "UserId", newName: "ConsumerId");
            RenameColumn(table: "dbo.Assignments", name: "Task_ExerciseId", newName: "Task_TaskId");
            CreateIndex("dbo.Diet_Meal", "MealId");
            CreateIndex("dbo.Diet_Meal", "DietId");
            CreateIndex("dbo.Meal_Ingredient", "IngredientId");
            CreateIndex("dbo.Meal_Ingredient", "MealId");
            CreateIndex("dbo.WorkOut_Task", "TaskId");
            CreateIndex("dbo.WorkOut_Task", "WorkOutId");
            CreateIndex("dbo.Assignments", "Task_TaskId");
            CreateIndex("dbo.PreConsumers", "ContentAuthorId");
            CreateIndex("dbo.PreConsumers", "Plan_PlanId");
            CreateIndex("dbo.Plans", "AuthorId");
            CreateIndex("dbo.UserProfiles", "ContentAuthorId");
            AddForeignKey("dbo.Diet_Meal", "MealId", "dbo.Meals", "MealId", cascadeDelete: true);
            AddForeignKey("dbo.Diet_Meal", "DietId", "dbo.Diets", "DietId", cascadeDelete: true);
            AddForeignKey("dbo.Meal_Ingredient", "IngredientId", "dbo.Ingredients", "IngredientId", cascadeDelete: true);
            AddForeignKey("dbo.Meal_Ingredient", "MealId", "dbo.Meals", "MealId", cascadeDelete: true);
            AddForeignKey("dbo.WorkOut_Task", "TaskId", "dbo.JdtTasks", "TaskId", cascadeDelete: true);
            AddForeignKey("dbo.WorkOut_Task", "WorkOutId", "dbo.WorkOuts", "WorkOutId", cascadeDelete: true);
            AddForeignKey("dbo.Assignments", "Task_TaskId", "dbo.JdtTasks", "TaskId");
            AddForeignKey("dbo.PreConsumers", "ContentAuthorId", "dbo.UserProfiles", "Id", cascadeDelete: true);
            AddForeignKey("dbo.PreConsumers", "Plan_PlanId", "dbo.Plans", "PlanId");
            AddForeignKey("dbo.Plans", "AuthorId", "dbo.UserProfiles", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserProfiles", "ContentAuthorId", "dbo.UserProfiles", "Id");
        }
    }
}
