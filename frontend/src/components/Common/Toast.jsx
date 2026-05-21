import { useNotification } from '../../hooks/useNotification';

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${typeStyles[notif.type]} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
        >
          <span className="flex-1">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="text-white hover:text-gray-200 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
