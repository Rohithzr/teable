import { ArrowUpRight, Download } from '@teable/icons';
import { ShareViewContext } from '@teable/sdk/context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';
import { TeableLogo } from '@/components/TeableLogo';
import { useBrand } from '@/features/app/hooks/useBrand';
import { useDownload } from '@/features/app/hooks/useDownLoad';
import { shareConfig } from '@/features/i18n/share.config';

export const EmbedFooter = ({
  hideBranding,
  hideNewPage,
}: {
  hideBranding?: boolean;
  hideNewPage?: boolean;
}) => {
  const router = useRouter();
  const { t } = useTranslation(shareConfig.i18nNamespaces);
  const { viewId, shareId } = useContext(ShareViewContext);
  const { trigger: downloadCsv } = useDownload({
    downloadUrl: `/api/share/${shareId}/export?viewId=${viewId}`,
    key: 'share',
  });
  const fullPath = router.asPath;
  const url = new URL(fullPath, 'https://app.teable.io'); // Use a dummy base URL
  url.searchParams.delete('embed');
  const pathWithoutEmbed = `${url.pathname}${url.search}`;
  const { brandName } = useBrand();

  return (
    <div className="flex items-center justify-between border-t px-2 py-1 text-xs">
      {!hideBranding && (
        <Link href="/" className="flex items-center gap-1" target="_blank">
          <TeableLogo className="size-4" />
          {brandName}
        </Link>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={downloadCsv} className="flex items-center gap-1">
          <Download className="size-4" />
          {t('table:import.menu.downAsCsv')}
        </button>
        {!hideNewPage && (
          <Link className="flex gap-1" href={pathWithoutEmbed} target="_blank">
            <ArrowUpRight className="size-4" />
            {t('share:openOnNewPage')}
          </Link>
        )}
      </div>
    </div>
  );
};
