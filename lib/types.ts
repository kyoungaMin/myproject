export interface Stock {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  change_amount: number;
  volume: number;
  market_cap: number;
  composite_score: number;
  score_breakdown: {
    volume_score: number;
    change_score: number;
    appearance_bonus: number;
  };
  sources: string[];
  sector: string;
  selection_reason?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  title_original: string;
  source: string;
  published_at: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  summary: string;
}

export interface StockChartData {
  date: string;
  price: number;
  volume: number;
  change_percent: number;
}

export interface SNSLink {
  id: string;
  platform: 'twitter' | 'reddit' | 'youtube' | 'stocktwits' | 'seeking_alpha';
  title: string;
  url: string;
  view_count: number;
  posted_at: string;
  author: string;
}

export interface StockDetail extends Stock {
  description: string;
  ceo: string;
  employees: number;
  headquarters: string;
  founded: number;
  website: string;
  chart_data: StockChartData[];
  recent_news: NewsItem[];
  sns_links: SNSLink[];
}

export interface Briefing {
  id: string;
  briefing_type: 'daily' | 'weekly' | 'special';
  target_date: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'generating' | 'scheduled' | 'failed';
  created_at: string;
  published_at?: string;
  market_overview: {
    summary: string;
    indices: Array<{
      name: string;
      value: number;
      change_percent: number;
    }>;
  };
  featured_stocks: Stock[];
  content: {
    text_summary: string;
    key_points: string[];
    word_count: number;
  };
  images: {
    main: {
      url: string;
      width: number;
      height: number;
      alt_text: string;
    };
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
  };
  delivery_stats?: {
    total_sent: number;
    email_sent: number;
    slack_sent: number;
    open_rate: number;
    click_rate: number;
  };
}
