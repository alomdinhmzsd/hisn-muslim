'use client';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
    return (
        <div className="search-container">
            <div className="search-sunken">
                <Search size={22} style={{ color: '#444c56' }} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 132 chapters..."
                    className="search-input"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="search-clear">
                        <X size={22} />
                    </button>
                )}
            </div>
        </div>
    );
}