export interface TmdbMovie {
    "adult": boolean,
    "backdrop_path": string,
    "id": number,
    "title": string,
    "original_title": string,
    "overview": string,
    "poster_path": string,
    "media_type": string,
    "original_language": string,
    "genre_ids": number[],
    "popularity": number,
    "release_date": Date,
    "video": boolean,
    "vote_average": number,
    "vote_count": number
}

export interface TmdbSeries {
    "backdrop_path": string,
    "first_air_date": Date,
    "genre_ids": number[],
    "id": number,
    "name": string,
    "origin_country": string[],
    "original_language": string,
    "original_name": string,
    "overview": string,
    "popularity": number,
    "poster_path": string,
    "vote_average": number,
    "vote_count": number
}

export interface TmdbGenre {
    id: number;
    name: string;
}

export interface ProductionCompanies {
    "id": number,
    "logo_path": string,
    "name": string,
    "origin_country": string
}

export interface ProductionCountries {
    "iso_3166_1": string,
    "name": string
}

export interface SpokenLanguages {
    "english_name": string,
    "iso_639_1": string,
    "name": string
}

export interface TmdbCast {
    "adult": boolean,
    "gender": number,
    "id": number,
    "known_for_department": string,
    "name": string,
    "original_name": string,
    "popularity": number,
    "profile_path": string,
    "cast_id": number,
    "character": string,
    "credit_id": string,
    "order": number
}

export interface TmdbCrew {
    "adult": false,
    "gender": number,
    "id": number,
    "known_for_department": string,
    "name": string,
    "original_name": string,
    "popularity": number,
    "profile_path": string,
    "credit_id": string,
    "department": string,
    "job": string
}

export interface TmdbCreditsResponse {
    "cast": TmdbCast[],
    "crew": TmdbCrew[]
}

export interface TmdbMovieByIdResponse {
    "adult": boolean,
    "backdrop_path": string,
    "belongs_to_collection": null,
    "budget": number,
    "genres": TmdbGenre[],
    "homepage": string,
    "id": 1315303,
    "imdb_id": string,
    "origin_country": string[],
    "original_language": string,
    "original_title": string,
    "overview": string,
    "popularity": number,
    "poster_path": string,
    "production_companies": ProductionCompanies[],
    "production_countries": ProductionCountries[],
    "release_date": Date,
    "revenue": number,
    "runtime": number,
    "spoken_languages": SpokenLanguages[],
    "status": string,
    "tagline": string,
    "title": string,
    "video": boolean,
    "vote_average": number,
    "vote_count": number,
    "credits": TmdbCreditsResponse,
}

export interface TmdbReviewsResponse {

    "adult": boolean,
    "backdrop_path": string,
    "id": number,
    "title": string,
    "original_title": string,
    "overview": string,
    "poster_path": string,
    "media_type": string,
    "original_language": string,
    "genre_ids": number[],
    "popularity": number,
    "release_date": Date,
    "video": boolean,
    "vote_average": number,
    "vote_count": number
}


export interface TmdbListApiResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}