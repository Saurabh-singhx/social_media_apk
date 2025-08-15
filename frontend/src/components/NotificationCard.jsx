import React from "react";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { contactsStore } from "../store/contactsStore";

export default function NotificationCard() {
    const { notifications, isLoadingNotifications } = contactsStore();

    const getIcon = (type) => {
        switch (type) {
            case "like":
                return <Heart className="text-red-500" size={20} />;
            case "comment":
                return <MessageCircle className="text-sky-500" size={20} />;
            case "follow":
                return <UserPlus className="text-green-500" size={20} />;
            default:
                return null;
        }
    };

    if (isLoadingNotifications) {
        return (
            <div className="max-w-md mx-auto space-y-3 mt-6">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={`loader-${i}`}
                        className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3 animate-pulse"
                    >
                        {/* Circle icon placeholder */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>

                        {/* Text placeholders */}
                        <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    return (
        <div className="max-w-md mx-auto space-y-3 mt-6">
            {notifications.length >= 1 && notifications.map((n) => (
                <div
                    key={n._id}
                    className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition-all"
                >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getIcon(n.type)}
                    </div>

                    {/* Text + Time */}
                    <div className="flex-1">
                        <p className="text-gray-800 text-sm">{n.text}</p>
                        <span className="text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            ))}
            {notifications.length === 0 && (
                <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg shadow-inner">
                    <p className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🔔</span>
                        <span className="text-sm font-medium">No notifications yet</span>
                        <span className="text-xs text-gray-400">We’ll let you know when something happens</span>
                    </p>
                </div>

            )}
        </div>
    );
}
