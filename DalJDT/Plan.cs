//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DalJDT
{
    using System;
    using System.Collections.Generic;
    
    public partial class Plan
    {
        public Plan()
        {
            this.PreConsumers = new HashSet<PreConsumer>();
        }
    
        public int PlanId { get; set; }
        public int AuthorId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public System.DateTime DateCreated { get; set; }
        public System.DateTime DateModified { get; set; }
    
        public virtual UserProfile UserProfile { get; set; }
        public virtual ICollection<PreConsumer> PreConsumers { get; set; }
    }
}
