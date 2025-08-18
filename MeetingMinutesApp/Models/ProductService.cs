using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetingMinutesApp.Models
{
    [Table("Products_Service_Tbl")]
    public class ProductService
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
    }
}
