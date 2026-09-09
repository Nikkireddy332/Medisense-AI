import { useTranslation } from 'react-i18next';

const mockNotifications = [
  { id: 1, title: 'Appointment Confirmed', text: 'Your appointment with Dr. Meera Iyer is confirmed for today at 10:30 AM.', time: '10 mins ago', icon: 'fas fa-calendar-check', type: 'success' },
  { id: 2, title: 'New Message', text: 'Dr. Priya Sharma sent you a message regarding your recent blood test.', time: '2 hrs ago', icon: 'fas fa-comment', type: 'primary' },
  { id: 3, title: 'Health Alert', text: 'Based on your recent reports, your blood sugar is slightly higher than usual.', time: 'Yesterday', icon: 'fas fa-exclamation-circle', type: 'warning' },
  { id: 4, title: 'System Update', text: 'We have added new language support for Telugu and Hindi!', time: '2 days ago', icon: 'fas fa-cog', type: 'info' }
];

export default function Notifications() {
  const { t } = useTranslation();

  return (
    <div className="notifications-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Notifications</h3>
        <button className="btn btn-link text-decoration-none">Mark all as read</button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="list-group list-group-flush">
              {mockNotifications.map(notification => (
                <div key={notification.id} className="list-group-item p-4 border-light cursor-pointer hover-bg-light transition">
                  <div className="d-flex gap-3">
                    <div className={`bg-${notification.type}-soft text-${notification.type} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                      <i className={notification.icon + ' fs-5'}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="fw-bold mb-1">{notification.title}</h6>
                        <span className="small text-muted">{notification.time}</span>
                      </div>
                      <p className="text-muted mb-0 small">{notification.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-3">Notification Settings</h6>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" defaultChecked id="emailNotif" />
              <label className="form-check-label small" htmlFor="emailNotif">Email Notifications</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" defaultChecked id="pushNotif" />
              <label className="form-check-label small" htmlFor="pushNotif">Push Notifications</label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="smsNotif" />
              <label className="form-check-label small" htmlFor="smsNotif">SMS Alerts</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
