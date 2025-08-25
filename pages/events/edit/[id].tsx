import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CreateEventInfoPage from '../../CreateEventInfoPage';
import type { EventData, PageName, UserRole } from '../../../HegiraApp';

const EventEditWrapper: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    if (!id) return;
    const s = Array.isArray(id) ? id[0] : id;
    try {
      const raw = sessionStorage.getItem(`hegira:event:${s}`);
      if (raw) {
        setEvent(JSON.parse(raw) as EventData);
        return;
      }
    } catch (err) {}
    // fallback: redirect back to events list
    router.replace('/events');
  }, [id, router]);

  if (!event) return null;

  const safeOnNavigate = (page: PageName, data?: any) => {
    try {
      let targetPath = '/';
      if (page === 'eventDetail' && data) {
        const slugKey = (data as EventData).eventSlug || String((data as EventData).id);
        sessionStorage.setItem(`hegira:event:${slugKey}`, JSON.stringify(data));
        targetPath = `/events/detail/${encodeURIComponent(slugKey)}`;
      } else if (page === 'checkout' && data) {
        sessionStorage.setItem('hegira:checkout', JSON.stringify(data));
        targetPath = '/checkout';
      } else if (page === 'events') {
        targetPath = '/events';
      } else if (page === 'landing') {
        targetPath = '/';
      } else if (page === 'business') {
        targetPath = '/business-matching';
      } else if (page === 'transactionSuccess') {
        targetPath = '/tickets/success';
      } else if (page === 'ticketDisplay') {
        targetPath = '/tickets';
      } else if (page === 'createEventInfo') {
        targetPath = '/create-event-info';
      }
      router.push(targetPath, undefined, { shallow: true }).catch(() => {});
    } catch (err) {
      console.warn('navigation failed', err);
    }
  };

  // Provide conservative defaults for auth context in this standalone page wrapper
  const isLoggedIn = false;
  const userRole: UserRole = null;

  return (
    <CreateEventInfoPage
      onNavigate={safeOnNavigate}
      onOpenAuthModal={() => { /* noop for standalone wrapper */ }}
      isLoggedIn={isLoggedIn}
      userRole={userRole}
    />
  );
};

export default EventEditWrapper;
