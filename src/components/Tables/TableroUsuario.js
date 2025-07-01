"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { LayoutGrid, Table2 } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    firstName: "María",
    lastName: "Gómez",
    username: "mariag",
    email: "maria@example.com",
    phone: "999-123-456",
    address: "Av. Siempre Viva 123",
    profileImage: "https://res.cloudinary.com/dabyqnijl/image/upload/v1748876681/ImagesNotariaRojas/b7mjspzvmortui8m7zsp.jpg",
  },
  {
    id: 2,
    firstName: "Carlos",
    lastName: "Ramírez",
    username: "carlosr",
    email: "carlos@example.com",
    phone: "987-654-321",
    address: "Jr. Los Olivos 456",
    profileImage: "https://res.cloudinary.com/dabyqnijl/image/upload/v1748876681/ImagesNotariaRojas/b7mjspzvmortui8m7zsp.jpg",
  },
];

export default function UsuarioTablero() {
  const [viewType, setViewType] = useState("table");
  
  return (
    <div className="space-y-4">
      {/* Selector de vista */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewType === "table" ? "default" : "outline"}
          onClick={() => setViewType("table")}
        >
          <Table2/>
        </Button>
        <Button
          variant={viewType === "card" ? "default" : "outline"}
          onClick={() => setViewType("card")}
        >
          <LayoutGrid/>
        </Button>
      </div>

      {/* Vista Tabla */}
      {viewType === "table" && (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Image
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{user.firstName} {user.lastName}</span>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Vista Tarjetas */}
      {viewType === "card" && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mockUsers.map((user) => (
            <Card key={user.id} className="p-4">
              <CardContent className="flex flex-col items-center text-center space-y-2">
                <Image
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div className="font-semibold text-lg">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.username}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-600">{user.phone}</div>
                <div className="text-sm text-gray-600">{user.address}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}