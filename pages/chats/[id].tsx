import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getArticle } from '@/config/firestore';
import { useEffect, useState } from 'react';
import { ExistingChatDisplay } from '@/components/ChatStuff/ExistingChatDisplay';

export default function ChatMain() {

    // Get current id from page context
    const { id } = useRouter().query;

    return (
        <ProtectedRoute>
            <ExistingChatDisplay chatId={String(id)} />
        </ProtectedRoute>
    );
}

