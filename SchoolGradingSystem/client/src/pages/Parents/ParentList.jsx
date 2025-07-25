import { useState, useEffect } from "react";
import API from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { 
  User, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ParentList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await API.get("/parents", {
        params: {
          page: currentPage,
          search: searchTerm,
          limit: 10,
        },
      });
      setParents(response.data.parents);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch parents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (parentId) => {
    navigate(`/parents/edit/${parentId}`);
  };

  const handleDelete = (parent) => {
    setSelectedParent(parent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedParent) return;
    
    setIsDeleting(true);
    try {
      await API.delete(`/parents/${selectedParent._id}`);
      toast({
        title: "Parent Deleted",
        description: `${selectedParent.firstName} ${selectedParent.lastName} has been removed`,
        variant: "success",
      });
      fetchParents();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete parent",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedParent(null);
    }
  };

  const formatPhone = (phone) => {
    return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 ($2) $3-$4");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Parents</h1>
            <p className="text-muted-foreground">
              View and manage Signuped parents
            </p>
          </div>
          <Button onClick={() => navigate("/parents/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Parent
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Parent Directory
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parents..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : parents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <User className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No parents found</p>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "No matching parents for your search" 
                    : "Start by adding a new parent"}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    navigate("/parents/add");
                  }}
                >
                  Add New Parent
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parent Name</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parents.map((parent) => (
                      <TableRow key={parent._id}>
                        <TableCell className="font-medium">
                          {parent.firstName} {parent.lastName}
                        </TableCell>
                        <TableCell>{parent.relationship}</TableCell>
                        <TableCell>{parent.email}</TableCell>
                        <TableCell>{formatPhone(parent.phone)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEdit(parent._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(parent)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedParent?.firstName} {selectedParent?.lastName}
              </span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ParentList;