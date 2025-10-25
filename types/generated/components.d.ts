import type { Schema, Struct } from '@strapi/strapi';

export interface AfricaAndSportAfricaAndSport extends Struct.ComponentSchema {
  collectionName: 'components_africa_and_sport_africa_and_sports';
  info: {
    displayName: 'africa and sport';
    icon: 'bulletList';
  };
  attributes: {
    africas: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    sports: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
  };
}

export interface BannerBanner extends Struct.ComponentSchema {
  collectionName: 'components_banner_banners';
  info: {
    displayName: 'banner';
    icon: 'bulletList';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
  };
}

export interface CultureAndPhilosophyCultureAndPhilosophy
  extends Struct.ComponentSchema {
  collectionName: 'components_culture_and_philosophy_culture_and_philosophy_s';
  info: {
    displayName: 'culture and philosophy ';
    icon: 'bulletList';
  };
  attributes: {
    cultures: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    philosophies: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    >;
  };
}

export interface InfographCardInfographCard extends Struct.ComponentSchema {
  collectionName: 'components_infograph_card_infograph_cards';
  info: {
    displayName: 'infograph Card';
    icon: 'bulletList';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.Text;
  };
}

export interface InfograpicInfograpic extends Struct.ComponentSchema {
  collectionName: 'components_infograpic_infograpics';
  info: {
    displayName: 'infograpic';
    icon: 'bulletList';
  };
  attributes: {
    infographs: Schema.Attribute.Relation<
      'oneToMany',
      'api::infograph.infograph'
    >;
  };
}

export interface LocalandinternationalaffairsLocalAndInternationalAffairs
  extends Struct.ComponentSchema {
  collectionName: 'components_localandinternationalaffairs_local_and_international_affairs';
  info: {
    displayName: 'local and international affairs';
    icon: 'bulletList';
  };
  attributes: {
    internations: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    >;
    local: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
  };
}

export interface OpinionOpinion extends Struct.ComponentSchema {
  collectionName: 'components_opinion_opinions';
  info: {
    displayName: 'opinion';
    icon: 'bulletList';
  };
  attributes: {
    israelis: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    opinions: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface VideoVideo extends Struct.ComponentSchema {
  collectionName: 'components_video_videos';
  info: {
    displayName: 'video';
    icon: 'bulletList';
  };
  attributes: {
    date: Schema.Attribute.String;
    title: Schema.Attribute.Text;
    videolink: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'africa-and-sport.africa-and-sport': AfricaAndSportAfricaAndSport;
      'banner.banner': BannerBanner;
      'culture-and-philosophy.culture-and-philosophy': CultureAndPhilosophyCultureAndPhilosophy;
      'infograph-card.infograph-card': InfographCardInfographCard;
      'infograpic.infograpic': InfograpicInfograpic;
      'localandinternationalaffairs.local-and-international-affairs': LocalandinternationalaffairsLocalAndInternationalAffairs;
      'opinion.opinion': OpinionOpinion;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'video.video': VideoVideo;
    }
  }
}
