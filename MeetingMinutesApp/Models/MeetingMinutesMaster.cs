
namespace MeetingMinutesApp.Models
{
    public class MeetingMinutesMaster
    {
        public int Id { get; set; }
        public string CustomerType { get; set; }
        public int CustomerId { get; set; }
        public string MeetingPlace { get; set; }
        public string Agenda { get; set; }
        public string Discussion { get; set; }
        public string Decision { get; set; }
        public string ClientSide { get; set; }
        public string HostSide { get; set; }
        public DateTime MeetingDate { get; set; }
        public string MeetingTime { get; set; }
        public List<MeetingMinutesDetail> Details { get; set; }
    }
}
