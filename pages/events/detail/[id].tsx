import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EventDetailPage from '../../EventDetailPage';
import type { EventData, PageName, CheckoutInfo } from '../../../HegiraApp';

const EventDetailWrapper: React.FC = () => {
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
    } catch (err) {
      // fallthrough to redirect
    }
    router.replace('/events');
  }, [id, router]);

  const onNavigate = (page: PageName, data?: any) => {
    try {
      let targetPath = '/';
      if (page === 'eventDetail' && data) {
        const slugKey = (data as EventData).eventSlug || String((data as EventData).id);
        sessionStorage.setItem(`hegira:event:${slugKey}`, JSON.stringify(data));
        targetPath = `/events/detail/${encodeURIComponent(slugKey)}`;
      } else if (page === 'checkout' && data) {
        sessionStorage.setItem('hegira:checkout', JSON.stringify(data as CheckoutInfo));
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
      }
      router.push(targetPath, undefined, { shallow: true }).catch(() => {});
    } catch (err) {
      console.warn('navigation failed', err);
    }
  };

  const onNavigateRequestWithConfirmation = (targetPage: PageName, targetData?: any, resetCallback?: () => void) => {
    const confirmed = typeof window !== 'undefined' ? window.confirm('Anda memiliki perubahan yang belum disimpan. Lanjutkan dan meninggalkan halaman?') : true;
    if (confirmed) {
      if (resetCallback) resetCallback();
      onNavigate(targetPage, targetData);
    }
  };

  if (!event) return null;

  return (
    <EventDetailPage event={event} onNavigate={onNavigate} onNavigateRequestWithConfirmation={onNavigateRequestWithConfirmation} />
  );
};

export default EventDetailWrapper;
