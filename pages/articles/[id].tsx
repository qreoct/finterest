import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getArticle } from '@/config/firestore';
import { useEffect, useState } from 'react';
import { ArticleFullDisplay } from '@/components/ArticleStuff/ArticleFullDisplay';

export default function ArticleMain() {

    // Get current id from page context
    const { id } = useRouter().query;

    return (
        <ProtectedRoute>
            <ArticleFullDisplay articleId={String(id)} />
        </ProtectedRoute>
    );
}