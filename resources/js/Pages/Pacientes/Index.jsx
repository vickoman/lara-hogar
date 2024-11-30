import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link, usePage, router } from "@inertiajs/react";
import TablaPacientes from "./Partials/TablaPacientes";
import { toast } from "react-toastify";

const Index = () => {
    const { pacientes, flash, filters } = usePage().props;
    const loggedUser = usePage().props.auth.user;
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            // Realiza la búsqueda solo si hay cambios en el query
            if (debouncedQuery.trim() !== filters.search) {
                setIsLoading(true);
                router.get(
                    route("pacientes.index"),
                    { search: debouncedQuery },
                    { preserveState: true, onFinish: () => setIsLoading(false) }
                );
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [debouncedQuery]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);

        if (e.target.value.trim() === "") {
            setDebouncedQuery("");
        } else {
            setDebouncedQuery(e.target.value);
        }
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                position: "bottom-right",
                autoClose: 3000, // Cierra el toast después de 3 segundos
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        if (flash?.error) {
            toast.error(flash.error, {
                position: "bottom-right",
                autoClose: 3000, // Cierra el toast después de 3 segundos
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [flash]);

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     router.get(
    //         route("pacientes.index"),
    //         { search: searchQuery },
    //         { preserveState: true }
    //     );
    // };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Listado de Pacientes
                </h2>
            }
        >
            <Head title="Pacientes" />

            <div className="p-12">
                <div className="overflow-x-auto bg-white p-4 max-w-screen-xl mx-auto rounded-lg">
                    <div className="relative m-[2px] mb-3 mr-5 float-left">
                        <form className="relative m-[2px] mb-3 mr-5 float-left">
                            <label htmlFor="inputSearch" className="sr-only">
                                Buscar Paciente
                            </label>
                            <input
                                id="inputSearch"
                                type="text"
                                placeholder="Nombre o cédula ..."
                                value={searchQuery}
                                onChange={handleInputChange}
                                className="block w-64 rounded-lg border py-2 pl-10 pr-4 text-sm focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-4 w-4 text-neutral-500 dark:text-neutral-200"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </span>
                        </form>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-4 w-4 text-neutral-500 dark:text-neutral-200"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                        </span>
                    </div>
                    {(loggedUser.role.name === "SuperAdmin" ||
                        loggedUser.role.name === "Administrativo") && (
                        <div className="relative m-[6px] mb-3 float-right hidden sm:block">
                            <Link
                                href={route("pacientes.create")}
                                className="
                                    px-4
                                    py-3
                                    rounded-full
                                    shadow
                                    bg-mainbutton
                                    "
                            >
                                +
                            </Link>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <TablaPacientes pacientes={pacientes} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;