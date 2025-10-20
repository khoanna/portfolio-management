"use client";

import useNews from "@/services/useNews";
import { useEffect, useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";

interface NewsItem {
  id: number;
  headline: string;
  shorterHeadline: string;
  dateLastPublished: string;
  dateFirstPublished: string;
  description: string;
  url: string;
  authorFormatted: string;
  sectionHierarchyFormatted: string;
  relatedTagsFilteredFormatted: string;
  type: string;
  promoImage?: {
    url: string;
  };
  section?: {
    tagName: string;
    url: string;
  };
}

interface NewsSection {
  id: number;
  name: string;
  headline: string;
  shortestHeadline: string;
  description: string;
  url: string;
  assets: NewsItem[];
}

export default function NewsPage() {
  const [newsSections, setNewsSections] = useState<NewsSection[]>([]);
  const [popularNews, setPopularNews] = useState<NewsItem[]>([]);
  const [reportsNews, setReportsNews] = useState<NewsItem[]>([]);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingSections, setLoadingSections] = useState(true);

  const [activeSection, setActiveSection] = useState<number>(0);
  const { getNews, getReportNews, getTrendingNews } = useNews();

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoadingTrending(true);
        const popularData = await getTrendingNews();
        const popular = popularData?.data?.data?.mostPopularEntries?.assets || [];
        setPopularNews(popular);
      } catch (error) {
        console.error("Error fetching trending news:", error);
      } finally {
        setLoadingTrending(false);
      }
    };

    const fetchReportNews = async () => {
      try {
        setLoadingReports(true);
        const reportsData = await getReportNews();
        const reports = reportsData?.data?.data?.specialReportsEntries?.results || [];
        setReportsNews(reports);
      } catch (error) {
        console.error("Error fetching report news:", error);
      } finally {
        setLoadingReports(false);
      }
    };

    const fetchSectionsNews = async () => {
      try {
        setLoadingSections(true);
        const listData = await getNews();
        const sections = listData?.data?.data?.sectionsEntries || [];
        setNewsSections(sections);
      } catch (error) {
        console.error("Error fetching sections news:", error);
      } finally {
        setLoadingSections(false);
      }
    };

    Promise.all([
      fetchTrendingNews(),
      fetchReportNews(),
      fetchSectionsNews()
    ]);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return formatDate(dateString);
    }
  };

  const getTags = (tagsString: string) => {
    if (!tagsString) return [];
    return tagsString.split('|').slice(0, 3);
  };

  const getAuthors = (authorsString: string) => {
    if (!authorsString || authorsString === 'NA') return null;
    const authors = authorsString.split('|');
    if (authors.length > 2) {
      return `${authors[0]} và ${authors.length - 1} người khác`;
    }
    return authors.join(', ');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cnbcvideo':
        return (
          <div className="absolute top-3 right-3 bg-red-500 rounded-full p-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const currentSection = newsSections[activeSection];

  // Skeleton for Trending News
  const TrendingSkeleton = () => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg animate-pulse" />
        <div>
          <div className="h-7 w-32 bg-text/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-text/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="lg:row-span-2 rounded-2xl overflow-hidden border border-text/10 bg-background">
          <div className="h-80 w-full bg-text/5 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-4 w-32 bg-text/10 rounded animate-pulse" />
            <div className="h-7 w-full bg-text/10 rounded animate-pulse" />
            <div className="h-7 w-3/4 bg-text/10 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-text/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-text/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-text/10 bg-background flex h-32">
              <div className="w-32 h-32 bg-text/5 animate-pulse flex-shrink-0" />
              <div className="p-4 flex-1 space-y-2">
                <div className="h-3 w-24 bg-text/10 rounded animate-pulse" />
                <div className="h-4 w-full bg-text/10 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-text/10 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-text/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Skeleton for Reports
  const ReportsSkeleton = () => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg animate-pulse" />
        <div>
          <div className="h-7 w-40 bg-text/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-text/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-text/10 bg-background">
            <div className="h-40 w-full bg-text/5 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-24 bg-text/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-text/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-text/10 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-text/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Skeleton for Section Articles
  const SectionSkeleton = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-text/10 bg-background">
          <div className="h-48 w-full bg-text/5 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-32 bg-text/10 rounded animate-pulse" />
            <div className="h-5 w-full bg-text/10 rounded animate-pulse" />
            <div className="h-5 w-4/5 bg-text/10 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-text/10 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-text/10 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-text/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Tin tức thị trường</h1>
          <p className="text-text/60">Cập nhật tin tức mới nhất từ CNBC</p>
        </div>

        {/* Trending News Section */}
        {loadingTrending ? (
          <TrendingSkeleton />
        ) : popularNews.length > 0 ? (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Tin nổi bật</h2>
                <p className="text-sm text-text/60">Những tin tức được quan tâm nhất</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Featured Article (First Item - Larger) */}
              {popularNews[0] && (
                <article
                  onClick={() => window.open(popularNews[0].url, '_blank')}
                  className="lg:row-span-2 group cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-text/10 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover:shadow-2xl hover:border-orange-500/30 transition-all duration-300"
                >
                  {popularNews[0].promoImage && (
                    <div className="relative h-80 w-full overflow-hidden bg-text/5">
                      <img
                        src={popularNews[0].promoImage.url}
                        alt={popularNews[0].headline}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {getTypeIcon(popularNews[0].type)}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                          🔥 HOT NHẤT
                        </span>
                      </div>
                      {popularNews[0].section && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-sm text-white">
                            {popularNews[0].section.tagName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-text/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatRelativeTime(popularNews[0].dateLastPublished)}</span>
                      {getAuthors(popularNews[0].authorFormatted) && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{getAuthors(popularNews[0].authorFormatted)}</span>
                        </>
                      )}
                    </div>
                    <h2 className="font-bold text-2xl mb-4 text-text group-hover:text-orange-500 transition-colors">
                      {popularNews[0].shorterHeadline || popularNews[0].headline}
                    </h2>
                    <p className="text-base text-text/70 mb-4 line-clamp-4">
                      {popularNews[0].description}
                    </p>
                    {popularNews[0].relatedTagsFilteredFormatted && getTags(popularNews[0].relatedTagsFilteredFormatted).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {getTags(popularNews[0].relatedTagsFilteredFormatted).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-3 py-1.5 rounded-full font-medium bg-orange-500/20 text-orange-600"
                          >
                            {tag.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )}

              {/* Other Popular Articles */}
              <div className="space-y-4">
                {popularNews.slice(1, 4).map((news, index) => (
                  <article
                    key={news.id}
                    onClick={() => window.open(news.url, '_blank')}
                    className="group cursor-pointer rounded-xl overflow-hidden shadow-md border border-text/10 bg-background hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 flex"
                  >
                    {news.promoImage && (
                      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-text/5">
                        <img
                          src={news.promoImage.url}
                          alt={news.headline}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {getTypeIcon(news.type)}
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-600">
                          #{index + 2}
                        </span>
                        <span className="text-xs text-text/60">
                          {formatRelativeTime(news.dateLastPublished)}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm mb-2 text-text group-hover:text-orange-500 transition-colors line-clamp-2">
                        {news.shorterHeadline || news.headline}
                      </h3>
                      <p className="text-xs text-text/60 line-clamp-2">
                        {news.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Special Reports Section */}
        {loadingReports ? (
          <ReportsSkeleton />
        ) : reportsNews.length > 0 ? (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Báo cáo đặc biệt</h2>
                <p className="text-sm text-text/60">Phân tích chuyên sâu từ các chuyên gia</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportsNews.slice(0, 4).map((report) => (
                <article
                  key={report.id}
                  onClick={() => window.open(report.url, '_blank')}
                  className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-text/10 bg-gradient-to-br from-purple-500/5 to-blue-500/5 hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300"
                >
                  {report.promoImage && (
                    <div className="relative h-40 w-full overflow-hidden bg-text/5">
                      <img
                        src={report.promoImage.url}
                        alt={report.headline}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {getTypeIcon(report.type)}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md">
                          📊 REPORT
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs text-text/60">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatRelativeTime(report.dateLastPublished)}</span>
                    </div>
                    <h3 className="font-bold text-base mb-2 text-text group-hover:text-purple-500 transition-colors line-clamp-3">
                      {report.shorterHeadline || report.headline}
                    </h3>
                    <p className="text-xs text-text/60 line-clamp-2 mb-3">
                      {report.description}
                    </p>
                    {report.section && (
                      <span className="inline-block text-[10px] px-2 py-1 rounded-full font-medium bg-purple-500/20 text-purple-600">
                        {report.section.tagName}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {/* Divider */}
        {((!loadingTrending && popularNews.length > 0) || (!loadingReports && reportsNews.length > 0)) && (!loadingSections && newsSections.length > 0) && (
          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-text/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-background text-sm font-semibold text-text/60">
                Tin tức theo chủ đề
              </span>
            </div>
          </div>
        )}

        {/* Sections Tabs */}
        {loadingSections ? (
          <div className="mb-8">
            <div className="flex gap-3 pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-32 bg-text/10 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : newsSections.length > 0 && (
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {newsSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`px-6 cursor-pointer py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeSection === index
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-foreground text-text/70 hover:bg-foreground/80 hover:text-text"
                  }`}
                >
                  {section.shortestHeadline || section.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Info */}
        {loadingSections ? (
          <div className="mb-6 p-6 rounded-2xl border border-text/10 bg-background">
            <div className="h-7 w-2/3 bg-text/10 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-text/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-4/5 bg-text/10 rounded animate-pulse mb-3" />
            <div className="h-5 w-32 bg-text/10 rounded animate-pulse" />
          </div>
        ) : currentSection && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-text mb-2">{currentSection.headline}</h2>
            <p className="text-text/70 mb-3">{currentSection.description}</p>
            <a
              href={currentSection.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
            >
              Xem tất cả bài viết
              <ChevronRight size={16} />
            </a>
          </div>
        )}

        {/* Grid layout */}
        {loadingSections ? (
          <SectionSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSection?.assets.map((news) => (
            <article
              key={news.id}
              onClick={() => window.open(news.url, '_blank')}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-text/10 bg-background hover:shadow-2xl hover:border-text/20 transition-all duration-300"
            >
              {/* Image */}
              {news.promoImage && (
                <div className="relative h-48 w-full overflow-hidden bg-text/5">
                  <img
                    src={news.promoImage.url}
                    alt={news.headline}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Type Icon */}
                  {getTypeIcon(news.type)}
                  {/* Category Badge */}
                  {news.section && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-md">
                        {news.section.tagName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5">
                {/* Meta info */}
                <div className="flex items-center gap-2 mb-3 text-xs text-text/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatRelativeTime(news.dateLastPublished)}</span>
                  {getAuthors(news.authorFormatted) && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{getAuthors(news.authorFormatted)}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-bold text-lg mb-3 text-text group-hover:text-blue-500 transition-colors line-clamp-2">
                  {news.shorterHeadline || news.headline}
                </h2>

                {/* Description */}
                <p className="text-sm text-text/70 mb-4 line-clamp-3">
                  {news.description}
                </p>

                {/* Tags */}
                {news.relatedTagsFilteredFormatted && getTags(news.relatedTagsFilteredFormatted).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {getTags(news.relatedTagsFilteredFormatted).map((tag, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          index % 3 === 0
                            ? "bg-purple-500/20 text-purple-500"
                            : index % 3 === 1
                            ? "bg-green-500/20 text-green-500"
                            : "bg-orange-500/20 text-orange-500"
                        }`}
                      >
                        {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
          </div>
        )}

        {/* Empty State - only show if sections are loaded and empty */}
        {!loadingSections && newsSections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-24 h-24 text-text/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-text/60 text-center text-lg">
              Không có tin tức nào
            </p>
          </div>
        )}

        {!loadingSections && currentSection && currentSection.assets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-24 h-24 text-text/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-text/60 text-center text-lg">
              Mục này chưa có bài viết
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
