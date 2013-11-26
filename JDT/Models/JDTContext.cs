using JDT.App_Code;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class JDTContext : DbContext
    {
        public JDTContext()
            : base("JDT")
        {
            //WebSecurityInitializer.Instance.EnsureInitialize();
        }

        public DbSet<UserProfile> UserProfile { get; set; }

        public DbSet<JDT.Models.Plan> Plans { get; set; }

        public DbSet<JDT.Models.WorkOut> WorkOuts { get; set; }

        public DbSet<JDT.Models.Exercise> JdtTasks { get; set; }

        public DbSet<JDT.Models.Diet> Diets { get; set; }

        public DbSet<JDT.Models.Recipe> Recipes { get; set; }

        public DbSet<JDT.Models.Ingredient> Ingredients { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Plan>().HasMany(p => p.WorkOuts)
               .WithMany(p => p.Plans)
               .Map(m =>
               {
                   m.ToTable("Plan_WorkOut");
                   m.MapLeftKey("PlanId");
                   m.MapRightKey("WorkOutId");

               });

            modelBuilder.Entity<Plan>().HasMany(p => p.Diets)
               .WithMany(p => p.Plans)
               .Map(m =>
               {
                   m.ToTable("Plan_Diet");
                   m.MapLeftKey("PlanId");
                   m.MapRightKey("DietId");

               });

            modelBuilder.Entity<Plan>().HasRequired(p => p.Creator).
                WithMany(au => au.Plans).HasForeignKey(p => p.CreatorId).WillCascadeOnDelete(false);


            modelBuilder.Entity<UserProfile>().
                HasMany<UserProfile>(au => au.Friends).
                WithOptional(c => c.InvitedBy).HasForeignKey(c => c.InvitedById);

            modelBuilder.Entity<UserProfile>().
                HasMany<InvitedUser>(pc => pc.PreRegisteredFriends)
                .WithRequired(pc => pc.InvitedBy).HasForeignKey(pc => pc.InvitedById);

            modelBuilder.Entity<UserProfile>().
                HasMany<Assignment>(up => up.Assignments)
                .WithRequired(a => a.User).HasForeignKey(a => a.UserId);


            modelBuilder.Entity<WorkOut>().HasMany(wo => wo.Exercises)
              .WithMany(p => p.WorkOuts)
              .Map(m =>
              {
                  m.ToTable("WorkOut_Exercise");
                  m.MapLeftKey("WorkOutId");
                  m.MapRightKey("ExerciseId");

              });

            modelBuilder.Entity<Diet>().HasMany(wo => wo.Recipes)
              .WithMany(p => p.Diets)
              .Map(m =>
              {
                  m.ToTable("Diet_Recipe");
                  m.MapLeftKey("DietId");
                  m.MapRightKey("RecipeId");

              });

            modelBuilder.Entity<Recipe>().HasMany(m => m.Ingredients)
              .WithMany(i => i.Recipes)
              .Map(m =>
              {
                  m.ToTable("Recipe_Ingredient");
                  m.MapLeftKey("RecipeId");
                  m.MapRightKey("IngredientId");

              });
                
        }

        public DbSet<JDT.Models.InvitedUser> InvitedUsers { get; set; }
    }
}