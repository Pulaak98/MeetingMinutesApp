using MeetingMinutesApp.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetingMinutesApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<CorporateCustomer> CorporateCustomers { get; set; }
        public DbSet<IndividualCustomer> IndividualCustomers { get; set; }
        public DbSet<ProductService> ProductServices { get; set; }

        public DbSet<MeetingMinutesMaster> MeetingMinutesMasters { get; set; }
        public DbSet<MeetingMinutesDetail> MeetingMinutesDetails { get; set; }
    }

}
