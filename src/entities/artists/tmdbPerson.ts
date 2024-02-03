import { Person, PersonCombinedCreditsResponse, PersonExternalIdsResponse } from 'moviedb-promise'

export type TmdbPerson = Person & {
    combined_credits: PersonCombinedCreditsResponse,
    external_ids: PersonExternalIdsResponse,
};
