import {CSSProperties, default as React} from 'react';
import Select from 'react-select';
import {ColourOption, DropDownComponent} from "./DropDownComponent";

const {
    applicationID, adminAPIKey, index_name
} = env;

const algoliasearch = require("algoliasearch");

const client = algoliasearch(applicationID, adminAPIKey);

const currentAlgoliaIndex = client.initIndex(index_name);

export interface ItemOption {
    readonly value: string;
    readonly label: string;
}

export const lepelskiyUezd: readonly ItemOption[] = [
    { value: 'nizgolovo', label: 'Низголовская Иоанно-Предчетинская церковь' },
    { value: 'usaya', label: 'Усайская Покрова Пресвятой Богородицы церковь' },
    { value: 'hotino', label: 'Хотинская Святого Иосифа Обручника церковь' },
];

export interface GroupedOption {
    readonly label: string;
    readonly options: readonly ItemOption[];
}

export const groupedOptions: readonly GroupedOption[] = [
    {
        label: 'Уезды',
        options: lepelskiyUezd,
    },
];
const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};
const groupBadgeStyles: CSSProperties = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};

const formatGroupLabel = (data: GroupedOption) => (
    <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
);

const App = () => {
    const [value, setValue] = React.useState<string>('');
    const [facetsUezd, setFacetsUezd] = React.useState<any>({});
    const [uezdFilter, setUezdFilter] = React.useState<any>([]);
    const [facetsVolost, setFacetsVolost] = React.useState<any>({});
    const [volostFilter, setVolostFilter] = React.useState<any>([]);
    const [facetsOwner, setFacetsOwner] = React.useState<any>({});
    const [ownerFilter, setOwnerFilter] = React.useState<any>([]);
    const [hits, setHits] = React.useState<Array<any>>([]);
    React.useEffect(() => {
        currentAlgoliaIndex.search(value, {
            facets: ['*'],
            facetFilters: [
                [...uezdFilter.map((uezd: any) => `uezd:${uezd}`)],
                [...volostFilter.map((volost: any) => `volost:${volost}`)],
                [...ownerFilter.map((ownerTitle: any) => `ownerTitle:${ownerTitle}`)],
            ]
        })
            .then(({hits, facets}: any) => {
                setHits(hits);
                setFacetsUezd(facets.uezd);
                setFacetsVolost(facets.volost);
                setFacetsOwner(facets.ownerTitle);
            });
    }, [value, ownerFilter, volostFilter, uezdFilter]);
    const searchHandler = ({target}: any) => {
        setValue(target.value);
    }

    return <div>
        <DropDownComponent items={facetsUezd ? Object.keys(facetsUezd).map((facet) => ({value: facet, label: facet})) : []} changeHandler={(e: any) => setUezdFilter(e.map(({value}: any) => value))}></DropDownComponent>
        <DropDownComponent items={facetsVolost ? Object.keys(facetsVolost).map((facet) => ({value: facet, label: facet})) : []} changeHandler={(e: any) => setVolostFilter(e.map(({value}: any) => value))}></DropDownComponent>
        <DropDownComponent items={facetsOwner ? Object.keys(facetsOwner).map((facet) => ({value: facet, label: facet})) : []} changeHandler={(e: any) => setOwnerFilter(e.map(({value}: any) => value))}></DropDownComponent>
        <input autoFocus onChange={searchHandler} type="text" value={value} id="input"/>
        <ul className="list-group">
            {
                hits.map(({npTitle, ownerTitle, uezd, volost}, index) => <li key={index} className="list-group-item">{npTitle}, {ownerTitle}, {uezd}, {volost}</li>)
            }
        </ul>
    </div>
};

export default App;